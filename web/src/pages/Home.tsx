import React from 'react'
import { useUsersQuery } from 'src/generated/graphql';

interface HomeProps {

}

export const Home: React.FC<HomeProps> = ({}) => {
    const {data, } = useUsersQuery({fetchPolicy: 'network-only'}); //fetchPolicy = won't read from cache, fetches from server every time
    if(!data){
        return(
            <div>Loading</div>
        );
    }

    return(
        <div>
            <div>
                Users:
            </div>
            <ul>
                {data.users.map(user => {
                    return <li key ={user.id}>{user.email}, {user.id}</li>
                })}
            </ul>
        </div>
        
    );
};