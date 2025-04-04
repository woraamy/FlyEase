// import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";

// @Entity()
// @Index(["city"])
// @Index(["code"])
// export class Airport {
//     @PrimaryGeneratedColumn()
//     id: number;

//     @Column({ unique: true, length: 4 })
//     code: string;

//     @Column({ length: 100 })
//     name: string;

//     @Column({ length: 100 })
//     city: string;

//     @Column({ length: 100 })
//     country: string;

//     @Column({ length: 500, nullable: true })
//     image: string;
// }

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