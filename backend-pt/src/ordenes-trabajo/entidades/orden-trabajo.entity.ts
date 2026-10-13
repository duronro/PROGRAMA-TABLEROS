import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Maquina } from '../../maquinas/entidades/maquinas.entity';
import { Componente } from '../../componentes/entidades/comp.entity';
import { TipoMantenimiento } from '../../mantenimientos/entidades/registro-mant.entity';

export enum EstadoOrden {
  PENDIENTE = 'pendiente',
  EN_PROCESO = 'en_proceso',
  COMPLETADA = 'completada',
}

@Entity('ordenes_trabajo')
export class OrdenTrabajo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20, unique: true })
  folio: string; // ej. "OT-000154"

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
    name: 'tipo_mantenimiento',
    type: 'enum',
    enum: TipoMantenimiento,
    default: TipoMantenimiento.PREVENTIVO,
  })
  tipoMantenimiento: TipoMantenimiento;

  @Column({
    type: 'enum',
    enum: EstadoOrden,
    default: EstadoOrden.PENDIENTE,
  })
  estado: EstadoOrden;

  @CreateDateColumn({ name: 'fecha_generacion' })
  fechaGeneracion: Date;

  @Column({ name: 'fecha_completada', type: 'datetime', nullable: true })
  fechaCompletada: Date | null;

  @Column({ name: 'asignado_a', length: 100, nullable: true })
  asignadoA: string | null;

  // Checklist (del diagrama de la empresa)
  @Column({ default: false })
  herramientas: boolean;

  @Column({ default: false })
  consumibles: boolean;

  @Column({ default: false })
  procedimiento: boolean;

  @Column({ default: false })
  ejecutado: boolean;

  @Column({ name: 'resultado_registrado', default: false })
  resultadoRegistrado: boolean;
}