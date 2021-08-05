import AsyncStorage from '@react-native-community/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Button, StyleSheet, Text, View } from 'react-native';
import { setAccessToken } from '../accessToken';
import {AuthContext} from '../AuthProvider';
import { useMeQuery } from '../generated/graphql';

export function Hello() {
    const {data, loading, error} = useMeQuery()
    const navigation = useNavigation();
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
  
    if (loading){
        return <View style={styles.center}>
            <ActivityIndicator size ='large'/>
        </View>
    }
    if (error){
        return <View style={styles.center}>
            <Text>Error</Text>
        </View>
    }
    if(!data){
        return(
            <Text style={styles.center}>No Data</Text>
        )
    }
    return (
        <View style={styles.center}>
            <Text >
             {data.me?.email}
            </Text>
            <Button
                onPress={() => {navigation.navigate('Bye')}}
                title="Bye"
                color="#841584"
                accessibilityLabel="Learn more about this purple button"
            />
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