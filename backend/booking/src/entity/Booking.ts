import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

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

    @Column({ nullable: true })
    passenger_id: number; // No FK to Passenger (Microservice-friendly)

    @Column({ length: 6, unique: true , nullable: true})
    booking_code: string;

    @Column({ length: 255, nullable: true })
    clerkId: string;

    @Column({ type: "enum", enum: BookingStatus, default: BookingStatus.PENDING })
    status : BookingStatus;

    @CreateDateColumn({ type: "timestamp" })
    created_at: Date;


}
