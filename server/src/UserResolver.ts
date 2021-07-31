import {Arg, Mutation, Query, Resolver} from 'type-graphql';

@Resolver()
export class UserResolver {
    @Query(() => String)
    hello() {
        return'hi!';
    }

    @Mutation()
    register(
        @Arg('email') email: string,
        @Arg('password') password: string,
    ){

        await User.insert({
            email.
        })
        return
    }

}