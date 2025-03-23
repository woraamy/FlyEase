import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";

@Entity()
@Index(["city"])
@Index(["code"])
export class Airport {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, length: 3 })
    code: string;

    @Column({ length: 100 })
    name: string;

    @Column({ length: 100 })
    city: string;

    @Column({ length: 100 })
    country: string;

    @Column({ length: 500, nullable: true })
    image: string;
}
