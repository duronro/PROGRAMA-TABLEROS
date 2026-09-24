import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Carga } from './entidades/cargas.entity';
import { CrearCargaDto } from './dto/crearcarg.dto';

@Injectable()
export class CargasService {
  constructor(
    @InjectRepository(Carga)
    private readonly cargaRepository: Repository<Carga>,
  ) {}

  async crear(dto: CrearCargaDto): Promise<Carga> {
    const yaExiste = await this.cargaRepository.findOne({
      where: { maquinaId: dto.maquinaId, folioCarga: dto.folioCarga },
    });

    if (yaExiste) {
      throw new ConflictException(
        `Ya existe una carga con el folio ${dto.folioCarga} para esta máquina`,
      );
    }

    const carga = this.cargaRepository.create(dto);
    return this.cargaRepository.save(carga);
  }

  async listarPorMaquina(maquinaId: number, desde?: string, hasta?: string) {
    const query = this.cargaRepository
      .createQueryBuilder('carga')
      .where('carga.maquinaId = :maquinaId', { maquinaId })
      .orderBy('carga.folioCarga', 'DESC');

    if (desde) {
      query.andWhere('carga.fechaHoraInicio >= :desde', { desde });
    }
    if (hasta) {
      query.andWhere('carga.fechaHoraInicio <= :hasta', { hasta });
    }

    return query.getMany();
  }

  async buscarPorId(id: number): Promise<Carga> {
    const carga = await this.cargaRepository.findOneBy({ id });
    if (!carga) {
      throw new NotFoundException(`Carga con id ${id} no encontrada`);
    }
    return carga;
  }

  /** Devuelve el folio de carga más reciente registrado para una máquina (o null si no tiene ninguna) */
  async obtenerFolioMasRecienteDeMaquina(maquinaId: number): Promise<number | null> {
    const ultima = await this.cargaRepository.findOne({
      where: { maquinaId },
      order: { folioCarga: 'DESC' },
    });
    return ultima ? ultima.folioCarga : null;
  }
}