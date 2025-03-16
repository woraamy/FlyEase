import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { User } from "./User"; // Assuming you have a User entity

@Entity()
export class Passenger {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User, { onDelete: "CASCADE" })
    @JoinColumn()
    user: User;

    @Column({ unique: true, length: 20 })
    passport_number: string;

    @Column({ type: "date" })
    date_of_birth: Date;

    @Column({ length: 100 })
    nationality: string;
}
