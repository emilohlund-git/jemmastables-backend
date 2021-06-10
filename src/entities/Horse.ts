import { Field, ObjectType } from "type-graphql";
import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  BaseEntity
} from "typeorm";

@ObjectType()
@Entity()
export class Horse extends BaseEntity {
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
  name!: string;

  @Field()
  @Column()
  nickname: string;

  @Field()
  @Column()
  owner!: string;

  @Field()
  @Column()
  after!: string;

  @Field()
  @Column()
  birthYear!: number;

  @Field()
  @Column()
  gender!: string;

  @Field()
  @Column()
  color!: string;

  @Field()
  @Column()
  image!: string;

  @Field()
  @Column()
  category!: string;
}
