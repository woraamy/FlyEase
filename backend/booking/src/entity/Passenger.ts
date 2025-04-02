import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

// enum for gender

export enum GenderStatus {
    Male = "M",
    Female = "F",
    NotSay = "O"
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

    @Column({ length: 255, unique: true , nullable: true})
    id_card: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 15 })
    phone: string;

    @Column({ type: 'varchar', length: 255 })
    nationality: string;

    @Column({ type: 'int', length: 3 })
    age: number;

    @Column({ type: 'enum',  enum: GenderStatus, default: GenderStatus.NotSay })
    Gender: GenderStatus;
}