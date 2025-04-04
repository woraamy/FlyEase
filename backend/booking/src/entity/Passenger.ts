import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

// enum for gender

export enum GenderStatus {
    male = "M",
    female = "F",
    unidentify = "O"
}

@Entity('passenger')
export class Passenger {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    first_name: string;

    @Column({ length: 255 })
    last_name: string;

    @Column({ length: 15, unique: true , nullable: true})
    passport: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 15 })
    phone: string;

    @Column({ type: 'varchar', length: 255 })
    nationality: string;

    @Column({ type: 'int' })
    age: number;

    @Column({ type: 'enum',  enum: GenderStatus, default: GenderStatus.unidentify })
    Gender: GenderStatus;
}