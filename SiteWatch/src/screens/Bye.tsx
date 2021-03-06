
import React from 'react';
import {StyleSheet, Text, View,  } from 'react-native';

import { useByeQuery } from '../generated/graphql';

interface ByeProps {

}

export const Bye: React.FC<ByeProps> = ({}) => {

    const {data, loading, error} = useByeQuery({fetchPolicy: 'network-only'})

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
        <Text>
            {data.bye}
        </Text>
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