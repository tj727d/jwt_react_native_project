
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, View } from 'react-native';

import { useMeQuery } from '../generated/graphql';

export function Hello() {
    const {data, loading, error} = useMeQuery({fetchPolicy: 'network-only'})
    const navigation = useNavigation();

   
  

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
            <Button
                onPress={() => {navigation.navigate('Users')}}
                title="Users"
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