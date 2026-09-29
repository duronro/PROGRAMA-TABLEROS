import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {MantenimientoMaquina} from './entidades/mant-maquina.entity';
import {MaquinasService} from '../maquinas/maquinas.service';
import {ComponentesService} from '../componentes/componentes.service';
import {CargasService} from '../cargas/cargas.service';
import {TipoPeriodicidad} from '../componentes/entidades/comp.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { RegistroMantenimiento } from './entidades/registro-mant.entity';
import { RegistrarMantenimientoDto } from './dto/crearmant.dto';

// Excepciones conocidas: nombre de máquina + nombre de componente -> valor override
const EXCEPCIONES: {maquina: string; componente: string; valor: number}[] = [
    { 
        maquina: 'IP2', 
        componente: 'Mantenimiento de Termopares', 
        valor:50 
    },
    { 
        maquina: 'IP2', 
        componente: 'Cubiertas - Protectores superiores e inferiores y seguros', 
        valor:2
    },
    { 
        maquina: 'IP2',
        componente: 'Cubiertas - Faldon',
        valor:2
    }
];

export type EstadoMantenimiento = 'al dia' | 'proximo' | 'vencido';

@Injectable()
export class MantenimientosMaquinasService {
    constructor(
        @InjectRepository(MantenimientoMaquina)
        private readonly repo: Repository<MantenimientoMaquina>,
         @InjectRepository(RegistroMantenimiento)   
        private readonly registroRepo: Repository<RegistroMantenimiento>,

        private readonly maquinasService: MaquinasService,
        private readonly componentesService: ComponentesService,
        private readonly cargasService: CargasService
    ){}

    async inicializar(): Promise<{creados: number; omitidos: number}> {
        const maquinas = await this.maquinasService.listarTodas();
        const componentes = await this.componentesService.listarTodos();

        let creados = 0;
        let omitidos = 0;

        for(const maquina of maquinas){
            for(const componente of componentes){
                const yaExiste = await this.repo.findOne({
                    where: {
                        maquinaId: maquina.id,
                        componenteId: componente.id
                    }
                });

                if(yaExiste){
                    omitidos++;
                    continue;
                }

                const excepcion = EXCEPCIONES.find(
                    (e) => e.maquina === maquina.nombre && e.componente === componente.nombre
                );

                const nuevo = this.repo.create({
                    maquinaId: maquina.id,
                    componenteId: componente.id,
                    valorPeriodicidadOverride: excepcion ? excepcion.valor : null,
                });

                await this.repo.save(nuevo);
                creados++;
            }
        }

        return {creados, omitidos};
    }

    async listarPorMaquina(maquinaId: number){
        return this.repo.find({
            where: {maquinaId},
            relations: {componente: true},
        });
    }

    async calcularEstado(maquinaId: number){
        const registros = await this.repo.find({
            where: {maquinaId},
            relations: {componente: true},
        });

        const folioActual = await this.cargasService.obtenerFolioMasRecienteDeMaquina(maquinaId);

        return registros.map((registro) => {
            const periodicidad = registro.valorPeriodicidadOverride ?? registro.componente.valorPeriodicidad;

            if(registro.componente.tipoPeriodicidad === TipoPeriodicidad.POR_CARGAS){
                return this.calcularEstadoPorCargas(registro, periodicidad, folioActual);
            } else {
                return this.calcularEstadoPorFecha(registro, periodicidad);
            }
        });
    }

    private calcularEstadoPorCargas(
        registro: MantenimientoMaquina,
        periodicidad: number,
        folioActual: number | null,
    ) {
         // Si nunca se ha hecho mantenimiento, o no hay cargas registradas todavía
        if(registro.ultimaCargaMantenimiento === null || folioActual === null){
            return {
                componenteId: registro.componenteId,
                componenteNombre: registro.componente.nombre,
                estado: 'vencido' as EstadoMantenimiento,
                cargasTranscurridas: null,
                cargasFaltantes: null,
                ultimaCargaMantenimiento: registro.ultimaCargaMantenimiento,
            };
        }

        const cargasTranscurridas = folioActual - registro.ultimaCargaMantenimiento;
        const cargasFaltantes = periodicidad - cargasTranscurridas;

        let estado: EstadoMantenimiento = 'al dia';
        if(cargasFaltantes <= 0){
            estado = 'vencido';
        } else if (cargasFaltantes <= 3){
            estado = 'proximo';
        }

        return{
            componenteId: registro.componente.id,
            componenteNombre: registro.componente.nombre,
            estado,
            cargasTranscurridas,
            cargasFaltantes,
            ultimaCargaMantenimiento: registro.ultimaCargaMantenimiento,
        };
    }

    private calcularEstadoPorFecha(registro: MantenimientoMaquina, periodicidadMeses: number ){
        if (registro.ultimaFechaMantenimiento === null){
            return {
                componenteId: registro.componente.id,
                componenteNombre: registro.componente.nombre,
                estado: 'vencido' as EstadoMantenimiento,
                proximaFecha: null,
                diasFaltantes: null,
            };
        }

        const proximaFecha = new Date(registro.ultimaFechaMantenimiento);
        proximaFecha.setMonth(proximaFecha.getMonth() + periodicidadMeses);

        const hoy = new Date();
        const diasFaltantes = Math.ceil(proximaFecha.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24);

        let estado: EstadoMantenimiento = 'al dia';
        if (diasFaltantes <= 0){
            estado = 'vencido';
        } else if (diasFaltantes <= 7){
            estado = 'proximo';
        }

        return{
            componenteId: registro.componente.id,
            componenteNombre: registro.componente.nombre,
            estado,
            proximaFecha,
            diasFaltantes,
        }
    }
    async registrar(dto: RegistrarMantenimientoDto) {
  const mantenimiento = await this.repo.findOne({
    where: { maquinaId: dto.maquinaId, componenteId: dto.componenteId },
    relations: { componente: true },
  });

  if (!mantenimiento) {
    throw new NotFoundException(
      'No existe esa combinación máquina-componente. ¿Ya corriste /inicializar?',
    );
  }

  const esPorCargas =
    mantenimiento.componente.tipoPeriodicidad === TipoPeriodicidad.POR_CARGAS;

  if (esPorCargas && !dto.cargaFolio) {
    throw new BadRequestException(
      'Este componente es por cargas: debes indicar el folio de carga (cargaFolio)',
    );
  }

  const fecha = new Date(dto.fechaRealizado);

  // Las dos escrituras van en una transacción: o se guardan ambas o ninguna
  return this.repo.manager.transaction(async (manager) => {
    const registro = manager.create(RegistroMantenimiento, {
      mantenimientoMaquinaId: mantenimiento.id,
      tipoMantenimiento: dto.tipoMantenimiento,
      cargaFolio: dto.cargaFolio ?? null,
      fechaRealizado: fecha,
      responsable: dto.responsable,
      tiempoEmpleado: dto.tiempoEmpleado ?? null,
      numeroCarro: dto.numeroCarro ?? null,
      notas: dto.notas,
    });
    await manager.save(registro);

    if (esPorCargas) {
      mantenimiento.ultimaCargaMantenimiento = dto.cargaFolio!;
    }
    mantenimiento.ultimaFechaMantenimiento = fecha;
    await manager.save(mantenimiento);

    return registro;
  });
}

async historialPorMaquina(maquinaId: number) {
  return this.registroRepo.find({
    where: { mantenimientoMaquina: { maquinaId } },
    relations: { mantenimientoMaquina: { componente: true } },
    order: { fechaRealizado: 'DESC' },
  });
}



}
