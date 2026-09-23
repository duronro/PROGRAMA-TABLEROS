import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {MantenimientoMaquina} from './entidades/mant-maquina.entity';
import {MaquinasService} from '../maquinas/maquinas.service';
import {ComponentesService} from '../componentes/componentes.service';

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

@Injectable()
export class MantenimientosMaquinasService {
    constructor(
        @InjectRepository(MantenimientoMaquina)
        private readonly repo: Repository<MantenimientoMaquina>,
        private readonly maquinasService: MaquinasService,
        private readonly componentesService: ComponentesService,
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
}