import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class Booking {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    flight_number: string; // No FK to Flight (Microservice-friendly)

    @Column({ length: 5 })
    seat_number: string;

    @Column()
    passenger_id: number; // No FK to Passenger (Microservice-friendly)

    @Column({ length: 6, unique: true })
    booking_code: string;

    @Column({ length: 255})
    clerkId: string;

    @CreateDateColumn({ type: "timestamp" })
    created_at: Date;

    
}
