import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

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
}