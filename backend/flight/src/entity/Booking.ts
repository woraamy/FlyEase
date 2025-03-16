import { 
    Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index 
} from "typeorm";
import { Passenger } from "./Passenger";
import { Flight } from "./Flight";

export enum BookingStatus {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    CANCELLED = "CANCELLED"
}

@Entity()
@Index(["booking_reference"])
@Index(["booking_date"])
export class Booking {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, length: 10 })
    booking_reference: string;

    @ManyToOne(() => Passenger, { onDelete: "CASCADE" })
    passenger: Passenger;

    @ManyToOne(() => Flight, { onDelete: "CASCADE" })
    flight: Flight;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    booking_date: Date;

    @Column({ type: "enum", enum: BookingStatus, default: BookingStatus.PENDING })
    status: BookingStatus;

    @Column({ length: 5 })
    seat_number: string;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    price_paid: number;
}
