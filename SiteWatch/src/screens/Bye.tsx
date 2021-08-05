import AsyncStorage from '@react-native-community/async-storage';
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { setAccessToken } from '../accessToken';
import {AuthContext} from '../AuthProvider';
import { useByeQuery } from '../generated/graphql';

interface ByeProps {

}

export const Bye: React.FC<ByeProps> = ({}) => {

    const {data, loading, error} = useByeQuery()

    const { user } = React.useContext(AuthContext);

    const [screenLoading, setLoading] = useState(true);
   
  
    useEffect(() => {
      fetch("http://localhost:4000/refresh_token", {
        method: "POST",
        credentials: "include"
      }).then(async x => {
        const { accessToken } = await x.json();
        setAccessToken(accessToken);
        console.log('user',user)
        console.log('saved token',accessToken)
        if (accessToken !== (user) && accessToken != ("")){
            console.log('saving user')
            AsyncStorage.setItem("user", accessToken);
        }
        setLoading(false);
      });
    }, []);
  
    if(screenLoading){
        return (
             <View style={styles.center}>
            <ActivityIndicator size ='large'/>
        </View>
        );
    }

    if(loading){
        return <Text> Loading ... </Text>
    }

    if(error){
        console.log(error)
        return <Text> err </Text>
    }

    if(!data){
        return <Text> no data </Text>
    }

    return (
        <Text>
            {data.bye}
        </Text>
    );
};

const styles = StyleSheet.create({
    center:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});