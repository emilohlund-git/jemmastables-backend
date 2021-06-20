import { ObjectType, Field } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@ObjectType()
@Entity()
export class Appointment extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;

  @Field()
  @Column()
  from!: string;

  @Field()
  @Column()
  to!: string;

  @Field()
  @Column()
  date!: string;

  @Field(() => Boolean)
  @Column()
  booked!: Boolean;

  @Field()
  @Column()
  bookedBy!: string;

  @Field()
  @Column({ nullable: true })
  type!: string;
}
