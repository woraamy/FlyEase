import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Aircraft } from './Aircraft';

@Entity()
export class AircraftWarehouse {
@PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Aircraft, (aircraft) => aircraft.id, { nullable: false })
    @JoinColumn({ name: 'aircraft_id' })
    aircraft: Aircraft;

    @Column({ name: 'flight_number', type: 'varchar', length: 10, nullable: false })
    flightNumber: string;
}