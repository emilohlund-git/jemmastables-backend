import { InputType, Field } from "type-graphql";
@InputType()
export class HorseUpdate {
  @Field({ nullable: true })
  name!: string;

  @Field({ nullable: true })
  nickname: string;

  @Field({ nullable: true })
  owner!: string;

  @Field({ nullable: true })
  after!: string;

  @Field({ nullable: true })
  birthYear!: number;

  @Field({ nullable: true })
  gender!: string;

  @Field({ nullable: true })
  color!: string;

  @Field({ nullable: true })
  image!: string;

  @Field(() => [String!], { nullable: true })
  images!: string[];

  @Field({ nullable: true })
  category!: string;
}
