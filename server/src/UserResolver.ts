import {Arg, Ctx, Field, Int, Mutation, ObjectType, Query, Resolver, UseMiddleware} from 'type-graphql';
import argon2 from 'argon2';
import { User } from './entity/User';
import { MyContext } from './MyContext';
import { createAccessToken, createRefreshToken } from './auth';
import {isAuth} from './isAuth';
import { sendRefreshToken } from './sendRefreshToken';
import { getConnection } from 'typeorm';
import { verify } from 'jsonwebtoken';


@ObjectType()
class LoginResponse {
    @Field()
    accessToken: string;

    @Field(() => User)
    user: User;
}


@Resolver()
export class UserResolver {
    @Query(() => String)
    hello() {
        return'hi!';
    }

    @Query(() => String)
    @UseMiddleware(isAuth)
    bye(
        @Ctx() {payload}: MyContext
    ) {
        console.log(payload);
        return`your user id is: ${payload!.userId}`;
    }

    @Query(() => User, {nullable: true})
    me(@Ctx() context: MyContext) {
        const authorization = context.req.headers["authorization"];
    
        if (!authorization) {
          return null;
        }
    
        try {
          const token = authorization.split(" ")[1];
          const payload: any = verify(token, process.env.ACCESS_TOKEN_SECRET!);
          return User.findOne(payload.userId);
        } catch (err) {
          console.log(err);
          return null;
        }
      }

    @Query(() => [User])
    users() {
        return User.find();
    }

    @Mutation(() => Boolean)
    async logout(
        @Ctx() {res}: MyContext
    ){
        sendRefreshToken(res,"");

        return true;
    }

    @Mutation(() => Boolean)
    async revokeRefreshTokensForUser(
        @Arg('userId', () => Int) userId: number
    ){
        await getConnection()
            .getRepository(User)
            .increment({id: userId}, 'tokenVersion', 1)

        return true;
    }

    @Mutation(() => LoginResponse)
    async login(
        @Arg('email') email: string,
        @Arg('password') password: string,
        @Ctx() {res}: MyContext
    ): Promise<LoginResponse> {
        const user = await User.findOne({where: {email}});

        if (!user){
            throw new Error('user does not exist')
        }

        const valid = await argon2.verify(user.password, password)

        if(!valid){
            throw new Error('bad password')
        }

        //login successful

        sendRefreshToken(res, createRefreshToken(user))

        return {
            accessToken: createAccessToken(user),
            user
        };
    }

    @Mutation(() => Boolean)
    async register(
        @Arg('email') email: string,
        @Arg('password') password: string,
    ){
        const hashedPassword = await argon2.hash(password);
        try{
            await User.insert({
                email,
                password: hashedPassword,
            });

            return true;
        } catch (err){
            console.log(err.message);
            return false;
        }
    }

}