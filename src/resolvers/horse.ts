import { Arg, Int, Mutation, Query, Resolver } from "type-graphql";
import { Horse } from "../entities/Horse";
import { HorseInput } from "./HorseInput";
import { HorseUpdate } from "./HorseUpdate";

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

  @Mutation(() => Horse, { nullable: true })
  async updateHorse(
    @Arg("id", () => Int) id: number,
    @Arg("input") input: HorseUpdate
  ): Promise<Horse | undefined> {
    const horse = await Horse.findOne(id);
    if (!horse) {
      return undefined;
    } 
    
    Horse.update({ id }, { ...input });
    return horse;
  }

  @Mutation(() => Boolean)
  async deleteHorse(@Arg("id") id: number): Promise<Boolean> {
    await Horse.delete(id);
    return true;
  }
}
