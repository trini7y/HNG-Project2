
import { BaseEntity , Column, Entity, PrimaryGeneratedColumn, ManyToMany, ManyToOne, JoinTable} from "typeorm";
import { User } from "./users/users.entity";

@Entity({ name: 'organisation' })
export class Organisation extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  orgId: string;

  @Column({ name: 'name', nullable: false })
  name: string;

  @Column({ name: 'description', nullable: true })
  description: string;

  @ManyToOne(() => User, (user) => user.createdOrganisations)
  creator: User;

  @ManyToMany(() => User, (user) => user.organisations)
  users: User[];
}