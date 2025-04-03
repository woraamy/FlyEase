import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";

@Entity()
@Index(["code"])
export class Airport {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 4, unique: true })
    code: string;

    @Column({ type: "varchar", length: 100 })
    name: string;

    @Column({ type: "varchar", length: 100 })
    city: string;

    @Column({ type: "varchar", length: 100 })
    country: string;

    @Column({ type: "varchar", nullable: true })
    image: string | null;
}