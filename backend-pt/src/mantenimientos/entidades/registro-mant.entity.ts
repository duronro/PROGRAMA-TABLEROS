import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
} from 'typeorm';
import { MantenimientoMaquina } from './mant-maquina.entity';

export enum TipoMantenimiento {
    PREVENTIVO = 'preventivo',
    CORRECTIVO = 'correctivo',  
    INSPECCION = 'inspeccion',
    LIMPIEZA = 'limpieza',
}

@Entity('registro_mantenimiento')
export class RegistroMantenimiento {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => MantenimientoMaquina)
    @JoinColumn({ name: 'mantenimiento_maquina_id' })
    mantenimientoMaquina: MantenimientoMaquina;

    @Column({ name:'mantenimiento_maquina_id' })
    mantenimientoMaquinaId: number;

    @Column({
        name: 'Tipo_mantenimiento',
        type: 'enum',
        enum: TipoMantenimiento,
        default: TipoMantenimiento.PREVENTIVO,
    })
    tipoMantenimiento: TipoMantenimiento;

    @Column({ name: 'carga_folio', type: 'int', nullable: true })
    cargaFolio: number | null;

    @Column({ name: 'fecha_realizado', type: 'datetime' })
    fechaRealizado: Date;

    @Column({ length: 100, nullable: true })
    responsable: string;

    @Column({ name: 'tiempo_empleado', type: 'float', nullable: true })
    tiempoEmpleado: number | null; // en horas

    @Column({ name: 'numero_carro', type: 'int', nullable: true })
    numeroCarro: number | null; // solo aplica al "Mantenimiento de carro"

    @Column({ type: 'text', nullable: true })
    notas: string;

    @CreateDateColumn({ name: 'fecha_registro' })
    fechaRegistro: Date;
}
