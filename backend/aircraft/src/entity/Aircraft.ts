import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { AircraftClass } from "./AircraftClass";

@Entity()
export class Aircraft {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, length: 100 })
    model_name: string;

    @OneToMany(() => AircraftClass, (aircraftClass) => aircraftClass.aircraft)
    classes: AircraftClass[];
}
