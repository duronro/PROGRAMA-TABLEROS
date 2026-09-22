import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Componente } from './entidades/comp.entity';
import { CrearCompDto } from './dto/crearcomp.dto';
import { ActualizarCompDto } from './dto/actualizar-componente.dto';

@Injectable()
export class ComponentesService {
  constructor(
    @InjectRepository(Componente)
    private readonly componenteRepository: Repository<Componente>,
  ) {}

  async crear(dto: CrearCompDto): Promise<Componente> {
    const componente = this.componenteRepository.create(dto);
    return this.componenteRepository.save(componente);
  }

  async listarTodos(): Promise<Componente[]> {
    return this.componenteRepository.find({ where: { activo: true } });
  }

  async buscarPorId(id: number): Promise<Componente> {
    const componente = await this.componenteRepository.findOneBy({ id });
    if (!componente) {
      throw new NotFoundException(`Componente con id ${id} no encontrado`);
    }
    return componente;
  }

  async actualizar(id: number, dto: ActualizarCompDto): Promise<Componente> {
    const componente = await this.buscarPorId(id);
    Object.assign(componente, dto);
    return this.componenteRepository.save(componente);
  }
}