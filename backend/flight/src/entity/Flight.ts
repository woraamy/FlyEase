import { 
    Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, 
    JoinTable, Index, OneToMany 
} from "typeorm";
import { Airport } from "./Airport";
import { TravelClass } from "./TravelClass";
import { FlightClassDetail } from "./FlightClassDetail";

@Entity()
@Index(["departure_time"])
@Index(["flight_number"])
@Index(["base_price"])
@Index(["rating"])
export class Flight {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", unique: true, length: 10 })
    flight_number: string;

    @ManyToOne(() => Airport, (airport) => airport.id, { onDelete: "CASCADE" })
    departure_airport: Airport;

    @ManyToOne(() => Airport, (airport) => airport.id, { onDelete: "CASCADE" })
    arrival_airport: Airport;

    @Column({ type: "timestamp" })
    departure_time: Date;

    @Column({ type: "timestamp" })
    arrival_time: Date;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    base_price: number;

    @Column({ type: "int" })
    available_seats: number;

    @Column({ type: "float", default: 0 })
    rating: number;

    @Column({ type: "varchar", length: 500, nullable: true })
    featured_image: string;

    @Column({ type: "boolean", default: false })
    has_wifi: boolean;

    @Column({ type: "boolean", default: false })
    has_entertainment: boolean;

    @Column({ type: "boolean", default: false })
    has_meals: boolean;

    @ManyToMany(() => TravelClass)
    @JoinTable()
    travel_classes: TravelClass[];

    @OneToMany(() => FlightClassDetail, (fcd) => fcd.flight)
    class_details: FlightClassDetail[];
}
