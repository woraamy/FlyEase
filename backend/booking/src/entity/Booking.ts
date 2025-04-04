import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from "typeorm";
import { Passenger } from "./Passenger";

//enum for booking status
export enum BookingStatus {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED"
}


@Entity()
export class Booking {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    flight_number: string; // No FK to Flight (Microservice-friendly)

    @Column({ length: 5 })
    seat_id: string;

    @Column({ length: 255 })
    seat_class: string;

    // FK to Passenger 
    @ManyToOne(() => Passenger, (passenger) => passenger.id, { onDelete: "CASCADE" , nullable: true, eager: true })
    passenger: number; 

    @Column({ length: 6, unique: true , nullable: true})
    booking_code: string;

    @Column({ length: 255, nullable: true })
    clerkId: string;

    @Column({ type: "enum", enum: BookingStatus, default: BookingStatus.PENDING })
    status : BookingStatus;

    @CreateDateColumn({ type: "timestamp" })
    created_at: Date;

    @Column({ length: 255, nullable: true })
    selected_meal: string;

    @Column({ length: 255, nullable: true })
    selected_service: string;

    @Column({ length: 255, nullable: true })
    selected_baggage: string;
}
