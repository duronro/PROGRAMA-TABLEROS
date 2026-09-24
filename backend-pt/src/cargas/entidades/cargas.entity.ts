import {Entity,Column,PrimaryGeneratedColumn,ManyToOne,JoinColumn,CreateDateColumn,Unique,} from 'typeorm';
import { Maquina } from '../../maquinas/entidades/maquinas.entity'; 

@Entity('cargas')
@Unique(['maquinaId', 'folioCarga']) // evita duplicar el mismo folio en la misma máquina
export class Carga {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Maquina)
  @JoinColumn({ name: 'maquina_id' })
  maquina: Maquina;

  @Column({ name: 'maquina_id' })
  maquinaId: number;

  @Column({ name: 'folio_carga', type: 'int' })
  folioCarga: number;

  @Column({ name: 'fecha_hora_inicio', type: 'datetime' })
  fechaHoraInicio: Date;

  @Column({ name: 'receta_proceso', length: 100, nullable: true })
  recetaProceso: string;

  @Column({ length: 100, nullable: true })
  material: string;

  @Column({ nullable: true })
  observaciones: string;

  @CreateDateColumn({ name: 'fecha_registro' })
  fechaRegistro: Date; // cuándo se capturó en el sistema (distinto de fechaHoraInicio)
}