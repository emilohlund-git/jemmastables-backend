import argon2 from "argon2";
import { MyContext } from "src/types";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver
} from "type-graphql";
import { getConnection } from "typeorm";
import { COOKIE_NAME } from "../constants";
import { User } from "../entities/User";

@InputType()
class UserNamePasswordInput {
  @Field()
  username: string;
  @Field()
  password: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  user(@Ctx() { req }: MyContext) {
    //Not logged in
    if (!req.session.userId) {
      return null;
    }
    return User.findOne(req.session.userId);
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UserNamePasswordInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const hashedPassword = await argon2.hash(options.password);
    let user;
    try {
      const result = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(User)
        .values({ username: options.username, password: hashedPassword })
        .returning("*")
        .execute();
      user = result.raw[0];
    } catch (err) {
      if (err.code === "23505") {
        // || err.detail.includes("already exists")) {
        return {
          errors: [
            {
              field: "username",
              message: "Användarnamnet existerar redan",
            },
          ],
        };
      }
    }

    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options") options: UserNamePasswordInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const user = await User.findOne({ where: { username: options.username } });
    if (!user) {
      return {
        errors: [
          { field: "username", message: "Användarnamnet existerar inte" },
        ],
      };
    }
    const valid = await argon2.verify(user.password, options.password);
    if (!valid) {
      return {
        errors: [{ field: "password", message: "Felaktigt lösenord" }],
      };
    }

    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }
        resolve(true);
      })
    );
  }
}
