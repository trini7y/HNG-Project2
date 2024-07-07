import { BaseEntity , Column, Entity, PrimaryGeneratedColumn, ManyToMany, OneToMany, JoinTable } from "typeorm";
import { Organisation } from "../organisation.entity";

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column({ name: 'first_name', nullable: false })
  firstName: string;

  @Column({ name: 'last_name', nullable: false })
  lastName: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ name: 'password', nullable: false })
  password: string;

  @Column({ name: 'phone' })
  phone: string;

  @ManyToMany(() => Organisation, (organisation) => organisation.users)
  @JoinTable()
  organisations: Organisation[];

  @OneToMany(() => Organisation, (organisation) => organisation.creator)
  createdOrganisations: Organisation[];
}