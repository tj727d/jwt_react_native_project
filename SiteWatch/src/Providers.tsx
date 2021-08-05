import AsyncStorage from '@react-native-community/async-storage';
import React, { useEffect, useState } from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { setAccessToken } from './accessToken';
import {AuthContext, AuthProvider} from './AuthProvider';
import {Routes} from './Routes';

interface ProvidersProps {

}

export const Providers: React.FC<ProvidersProps> = ({}) => {
    const [loading, setLoading] = useState(true);
    const { user } = React.useContext(AuthContext);

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

    if(loading){
        return (
             <View style={styles.center}>
            <ActivityIndicator size ='large'/>
        </View>
        );
    }

    return (
        <AuthProvider>
            <Routes />
        </AuthProvider>
    );
};

const styles = StyleSheet.create({
    center:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});