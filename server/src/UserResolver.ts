import {Arg, Mutation, Query, Resolver} from 'type-graphql';
import argon2 from 'argon2';
import { User } from './entity/User';

@Resolver()
export class UserResolver {
    @Query(() => String)
    hello() {
        return'hi!';
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