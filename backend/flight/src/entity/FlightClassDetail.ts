import { 
    Entity, PrimaryGeneratedColumn, ManyToOne, Column, Unique 
} from "typeorm";
import { Flight } from "./Flight";
import { TravelClass } from "./TravelClass";

@Entity()
@Unique(["flight", "travel_class"])
export class FlightClassDetail {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Flight, (flight) => flight.class_details, { onDelete: "CASCADE" })
    flight: Flight;

    @ManyToOne(() => TravelClass, { onDelete: "CASCADE" })
    travel_class: TravelClass;

    @Column({ type: "int" })
    available_seats: number;
}
