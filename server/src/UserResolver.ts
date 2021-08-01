import {Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver, UseMiddleware} from 'type-graphql';
import argon2 from 'argon2';
import { User } from './entity/User';
import { MyContext } from './MyContext';
import { createAccessToken, createRefreshToken } from './auth';
import {isAuth} from './isAuth';


@ObjectType()
class LoginResponse {
    @Field()
    accessToken: string
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

    @Query(() => [User])
    users() {
        return User.find();
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

        res.cookie(
            'jid',
            createRefreshToken(user),
            {
                httpOnly: true,
            }
        );

        return {
            accessToken: createAccessToken(user)
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