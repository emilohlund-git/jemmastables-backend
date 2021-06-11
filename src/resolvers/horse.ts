import { Arg, Args, Mutation, Query, Resolver } from "type-graphql";
import { GetHorseArgs } from "../args/getHorseArgs";
import { Horse } from "../entities/Horse";
import { HorseInput } from "./HorseInput";

@Resolver()
export class HorseResolver {
  @Query(() => [Horse])
  horses(): Promise<Horse[] | undefined> {
    return Horse.find();
  }

  @Query(() => [Horse])
  horsesByCategory(
    @Arg("category") category: string
  ): Promise<Horse[] | undefined> {
    return Horse.find({ category });
  }

  @Query(() => Horse, { nullable: true })
  horse(@Arg("id") id: number): Promise<Horse | undefined> {
    return Horse.findOne(id);
  }

  @Query(() => Horse, { nullable: true })
  horseByName(@Arg("name") name: string): Promise<Horse | undefined> {
    return Horse.findOne({ where: { name: name } });
  }

  @Mutation(() => Horse)
  async createHorse(@Arg("input") input: HorseInput): Promise<Horse> {
    return Horse.create({ ...input }).save();
  }

  @Mutation(() => Horse)
  async updateHorse(
    @Arg("id") id: number,
    @Args()
    {
      name,
      nickname,
      owner,
      after,
      birthYear,
      gender,
      color,
      image,
      category,
    }: GetHorseArgs
  ): Promise<Horse | undefined> {
    const horse = await Horse.findOne(id);
    if (!horse) {
      return undefined;
    }
    if (typeof name !== "undefined") horse.name = name;
    if (typeof nickname !== "undefined") horse.nickname = nickname;
    if (typeof owner !== "undefined") horse.owner = owner;
    if (typeof after !== "undefined") horse.after = after;
    if (typeof birthYear !== "undefined") horse.birthYear = birthYear;
    if (typeof gender !== "undefined") horse.gender = gender;
    if (typeof color !== "undefined") horse.color = color;
    if (typeof image !== "undefined") horse.image = image;
    if (typeof category !== "undefined") horse.category = category;
    Horse.update({ id }, { name });
    return horse;
  }

  @Mutation(() => Boolean)
  async deleteHorse(@Arg("id") id: number): Promise<Boolean> {
    await Horse.delete(id);
    return true;
  }
}
