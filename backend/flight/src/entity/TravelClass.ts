import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";

export enum TravelClassType {
    ECONOMY = "ECONOMY",
    BUSINESS = "BUSINESS",
    FIRST = "FIRST"
}

@Entity()
export class TravelClass {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "enum", enum: TravelClassType, unique: true })
    name: TravelClassType;

    @Column({ type: "decimal", precision: 3, scale: 2, default: 1.00 })
    price_multiplier: number;
}