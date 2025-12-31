import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'soat_apeseg', schema: 'public' })
export class SoatApeseg {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int4' })
    version: number;

    @Column({ name: 'plate', type: 'varchar', length: 20 })
    plate: string;

    @Column({ name: 'nombre_compania', type: 'varchar', length: 200, nullable: true })
    nombreCompania: string;

    @Column({ name: 'fecha_inicio', type: 'varchar', length: 50, nullable: true })
    fechaInicio: string;

    @Column({ name: 'fecha_fin', type: 'varchar', length: 50, nullable: true })
    fechaFin: string;

    @Column({ name: 'numero_poliza', type: 'varchar', length: 100, nullable: true })
    numeroPoliza: string;

    @Column({ name: 'nombre_uso_vehiculo', type: 'varchar', length: 100, nullable: true })
    nombreUsoVehiculo: string;

    @Column({ name: 'nombre_clase_vehiculo', type: 'varchar', length: 100, nullable: true })
    nombreClaseVehiculo: string;

    @Column({ name: 'estado', type: 'varchar', length: 50, nullable: true })
    estado: string;

    @Column({ name: 'codigo_unico_poliza', type: 'varchar', length: 100, nullable: true })
    codigoUnicoPoliza: string;

    @Column({ name: 'codigo_sbs_aseguradora', type: 'varchar', length: 50, nullable: true })
    codigoSBSAseguradora: string;

    @Column({ name: 'fecha_control_policial', type: 'varchar', length: 50, nullable: true })
    fechaControlPolicial: string;

    @Column({ name: 'nombre_contratante', type: 'varchar', length: 200, nullable: true })
    nombreContratante: string;

    @Column({ name: 'nombre_ubigeo', type: 'varchar', length: 200, nullable: true })
    nombreUbigeo: string;

    @Column({ name: 'numero_serie_motor', type: 'varchar', length: 100, nullable: true })
    numeroSerieMotor: string;

    @Column({ name: 'numero_serie_chasis', type: 'varchar', length: 100, nullable: true })
    numeroSerieChasis: string;

    @Column({ name: 'numero_aseguradora', type: 'varchar', length: 100, nullable: true })
    numeroAseguradora: string;

    @Column({ name: 'tipo_certificado', type: 'varchar', length: 50, nullable: true })
    tipoCertificado: string;

    @Column({ name: 'fecha_creacion', type: 'varchar', length: 50, nullable: true })
    fechaCreacion: string;

    @Column({ name: 'numero_asientos', type: 'varchar', length: 50, nullable: true })
    numeroAsientos: string;

    @Column({ name: 'modelo_vehiculo', type: 'varchar', length: 100, nullable: true })
    modeloVehiculo: string;

    @Column({ name: 'marca', type: 'varchar', length: 100, nullable: true })
    marca: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'now()' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: () => 'now()' })
    updatedAt: Date;

    @Column({ name: 'created_by', type: 'int4' })
    createdBy: number;
}
