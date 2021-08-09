import React from 'react'
import { View, Text, StyleSheet } from 'react-native';
import { useUsersQuery } from '../generated/graphql';

interface UsersProps {

}

export const Users: React.FC<UsersProps> = ({}) => {
    const {data, loading, error} = useUsersQuery({fetchPolicy: 'network-only'})

    if(loading){
        return( 
        <View style={styles.center}>
            <Text> Loading ... </Text>
        </View>
        )
    }

    if(error){
        console.log(error)
        return (
            <View style={styles.center}>
                <Text> err </Text>
            </View>
        )
    }

    if(!data){
        return (
        <View style={styles.center}>
            <Text> no data </Text>
        </View>
        )
    }

    return (
       <View style={styles.center}>
            {data.users && data.users.map(user =>{
                <Text> {user.email} </Text>
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    center:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});