import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum TipoPeriodicidad {
  POR_CARGAS = 'por_cargas',
  POR_FECHA = 'por_fecha',
}

@Entity('componentes')
export class Componente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  nombre: string; // ej. "Cubiertas - Faldón"

  @Column({
    type: 'enum',
    enum: TipoPeriodicidad,
    name: 'tipo_periodicidad',
  })
  tipoPeriodicidad: TipoPeriodicidad;

  @Column({ name: 'valor_periodicidad', type: 'int' })
  valorPeriodicidad: number; // ej. 4 (cargas) o 90 (días)

  @Column({ name: 'tiempo_estandar', type: 'float', nullable: true })
  tiempoEstandar: number; // en horas, ej. 1.5

  @Column({ name: 'metodo_procedimiento', type: 'text', nullable: true })
  metodoProcedimiento: string;

  @Column({ type: 'text', nullable: true })
  herramientas: string; // texto simple, ej. "Multímetro, llave 10mm"

  @Column({ type: 'text', nullable: true })
  consumibles: string;

  @Column({ name: 'personal_requerido', type: 'int', nullable: true })
  personalRequerido: number;

  @Column({ default: true })
  activo: boolean;
}