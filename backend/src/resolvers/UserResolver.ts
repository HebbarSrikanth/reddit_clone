import { User } from "../entities/User";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { MyContext } from "./types";
import argon2 from "argon2";

@InputType()
class userDetails {
  @Field()
  username: string;
  @Field()
  password: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => [FieldError], { nullable: true })
  error?: FieldError[];
}

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() { em, req }: MyContext): Promise<User | null> {
    if (!req.session.userId) return null;

    const user = await em.findOne(User, { id: req.session.userId });
    return user;
  }

  @Mutation(() => UserResponse)
  async registerUser(
    @Arg("option") option: userDetails,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    if (option.password === "" || option.password === undefined) {
      return {
        error: [
          {
            field: "Password",
            message: "Password should not be empty",
          },
        ],
      };
    }

    const existuser = await em.findOne(User, { username: option.username });

    if (existuser) {
      return {
        error: [
          {
            field: "Username",
            message: "Username already taken",
          },
        ],
      };
    }

    const hashedPassword = await argon2.hash(option.password);
    const user = em.create(User, {
      username: option.username,
      password: hashedPassword,
    });
    await em.persistAndFlush(user);

    //This will store the user session
    //And keep the user logged in

    req.session.userId = user.id;
    return {
      user,
    };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("option") option: userDetails,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, { username: option.username });

    if (!user) {
      return {
        error: [
          {
            field: "Username",
            message: "Username doesn't exist,please register",
          },
        ],
      };
    }

    const validPassword = await argon2.verify(user.password, option.password);

    if (!validPassword) {
      return {
        error: [
          {
            field: "Password",
            message: "Password is incorrect",
          },
        ],
      };
    }

    req.session.userId = user.id;

    return {
      user: user,
    };
  }
}
