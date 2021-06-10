import { InputType, Field } from "type-graphql";
@InputType()
export class HorseInput {
  @Field()
  name!: string;

  @Field()
  nickname: string;

  @Field()
  owner!: string;

  @Field()
  after!: string;

  @Field()
  birthYear!: number;

  @Field()
  gender!: string;

  @Field()
  color!: string;

  @Field()
  image!: string;

  @Field()
  category!: string;
}
