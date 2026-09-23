import{Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn} from 'typeorm';
import { Componente } from '../../componentes/entidades/comp.entity';
import { Maquina } from '../../maquinas/entidades/maquinas.entity';

@Entity('mantenimiento-maquinas')  //nombre de la tabla en la base de datos
export class MantenimientoMaquina {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Maquina)
  @JoinColumn({ name: 'maquina_id' })
  maquina: Maquina;

  @Column({ name: 'maquina_id' })
  maquinaId: number;

  @ManyToOne(() => Componente)
  @JoinColumn({ name: 'componente_id' })
  componente: Componente;

  @Column({ name: 'componente_id' })
  componenteId: number;

  @Column({
    name: 'valor_periodicidad_override',
    type: 'int',
    nullable: true,
  })
  valorPeriodicidadOverride: number | null;

  @Column({
    name: 'ultima_carga_mantenimiento',
    type: 'int',
    nullable: true,
  })
  ultimaCargaMantenimiento: number | null;

  @Column({
    name: 'ultima_fecha_mantenimiento',
    type: 'date',
    nullable: true,
  })
  ultimaFechaMantenimiento: Date | null;

}