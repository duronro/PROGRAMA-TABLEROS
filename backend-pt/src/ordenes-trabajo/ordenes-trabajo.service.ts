import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { OrdenTrabajo, EstadoOrden } from './entidades/orden-trabajo.entity';
import { MantenimientosMaquinasService } from '../mantenimientos/mant.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { MaquinasService } from '../maquinas/maquinas.service';
import { IniciarOrdenDto } from './dto/iniciar-orden.dto';
import { ActualizarChecklistDto } from './dto/actualizar-checklist.dto';
import { CompletarOrdenDto } from './dto/completar-orden.dto';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class OrdenesTrabajoService {
  constructor(
    @InjectRepository(OrdenTrabajo)
    private readonly repo: Repository<OrdenTrabajo>,
    private readonly mantenimientosService: MantenimientosMaquinasService,
    private readonly maquinasService: MaquinasService,
  ) {}

  private async generarFolio(): Promise<string> {
    const total = await this.repo.count();
    const siguiente = total + 1;
    return `OT-${siguiente.toString().padStart(6, '0')}`;
  }

  /** Revisa el estado de una máquina y genera órdenes para lo que esté "vencido" sin orden pendiente ya abierta */
  async generarParaMaquina(maquinaId: number) {
    const estados = await this.mantenimientosService.calcularEstado(maquinaId);
    const vencidos = estados.filter((e) => e.estado === 'vencido');

    const generadas: OrdenTrabajo[] = [];

    for (const item of vencidos) {
      const yaTieneOrdenAbierta = await this.repo.findOne({
        where: {
          maquinaId,
          componenteId: item.componenteId,
          estado: In([EstadoOrden.PENDIENTE, EstadoOrden.EN_PROCESO]),
        },
      });

      if (yaTieneOrdenAbierta) continue; // no duplicar

      const orden = this.repo.create({
        folio: await this.generarFolio(),
        maquinaId,
        componenteId: item.componenteId,
      });

      generadas.push(await this.repo.save(orden));
    }

    return generadas;
  }

  /** Revisa TODAS las máquinas (usado por el cron nocturno) */
  async generarParaTodasLasMaquinas(maquinaIds: number[]) {
    const resultado: Record<number, OrdenTrabajo[]> = {};
    for (const id of maquinaIds) {
      resultado[id] = await this.generarParaMaquina(id);
    }
    return resultado;
  }

  async listarPorEstado(estado?: EstadoOrden) {
    if (estado) {
      return this.repo.find({
        where: { estado },
        relations: { maquina: true, componente: true },
        order: { fechaGeneracion: 'DESC' },
      });
    }
    return this.repo.find({
      relations: { maquina: true, componente: true },
      order: { fechaGeneracion: 'DESC' },
    });
  }

  async buscarPorId(id: number) {
  const orden = await this.repo.findOne({
    where: { id },
    relations: { maquina: true, componente: true },
  });
  if (!orden) throw new NotFoundException(`Orden ${id} no encontrada`);
  return orden;
}

async iniciar(id: number, dto: IniciarOrdenDto) {
  const orden = await this.buscarPorId(id);
  if (orden.estado !== EstadoOrden.PENDIENTE) {
    throw new BadRequestException('Solo se puede iniciar una orden pendiente');
  }
  orden.estado = EstadoOrden.EN_PROCESO;
  orden.asignadoA = dto.asignadoA;
  return this.repo.save(orden);
}

async actualizarChecklist(id: number, dto: ActualizarChecklistDto) {
  const orden = await this.buscarPorId(id);
  Object.assign(orden, dto);
  return this.repo.save(orden);
}

async completar(id: number, dto: CompletarOrdenDto) {
  const orden = await this.buscarPorId(id);
  if (orden.estado === EstadoOrden.COMPLETADA) {
    throw new BadRequestException('Esta orden ya fue completada');
  }

  // Primero se registra el mantenimiento real (esto reinicia el contador).
  // Si falla (por ejemplo, falta cargaFolio), la orden NO se marca como completada.
  await this.mantenimientosService.registrar({
    maquinaId: orden.maquinaId,
    componenteId: orden.componenteId,
    tipoMantenimiento: orden.tipoMantenimiento,
    fechaRealizado: dto.fechaRealizado,
    cargaFolio: dto.cargaFolio,
    responsable: dto.responsable,
    tiempoEmpleado: dto.tiempoEmpleado,
    numeroCarro: dto.numeroCarro,
    notas: dto.notas,
  });

  orden.estado = EstadoOrden.COMPLETADA;
  orden.fechaCompletada = new Date();
  orden.ejecutado = true;
  orden.resultadoRegistrado = true;
  return this.repo.save(orden);
}

/** Revisión diaria automática de las 4 máquinas (cubre sobre todo los mantenimientos por fecha) */
@Cron('0 6 * * *', { timeZone: 'America/Mexico_City' })
async revisionDiaria() {
  const maquinas = await this.maquinasService.listarTodas();
  await this.generarParaTodasLasMaquinas(maquinas.map((m) => m.id));
}
}