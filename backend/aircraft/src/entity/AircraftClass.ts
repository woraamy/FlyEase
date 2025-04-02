import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Aircraft } from "./Aircraft";

export enum TravelClassType {
    FIRST = "FIRST",
    BUSINESS = "BUSINESS",
    ECONOMY = "ECONOMY"
}

@Entity()
export class AircraftClass {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Aircraft, (aircraft) => aircraft.classes, { onDelete: "CASCADE" })
    aircraft: Aircraft;

    @Column({ type: "enum", enum: TravelClassType })
    travel_class: TravelClassType;

    @Column({ type: "int" })
    total_rows: number;

    @Column({ type: "int" })
    total_columns: number;
}
