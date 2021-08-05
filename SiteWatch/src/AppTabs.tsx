import React, { useState } from 'react'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import { AppParamList } from './AppParamList';
import{View, StyleSheet, Text, TouchableOpacity, Alert, Switch} from 'react-native';
import {AuthContext} from './AuthProvider';
import Icon from 'react-native-vector-icons/dist/Ionicons'
import { InventoryStack } from './InventoryStack';
import { SettingsStack } from './SettingsStack';

interface AppTabsProps {

}

function Inventory() {
    return(
        <View style= {styles.center}>
            <Text>Inventory</Text>
        </View>
    )
}



const Tabs = createBottomTabNavigator<AppParamList>()

export const AppTabs: React.FC<AppTabsProps> = ({}) => {
    return (
        <Tabs.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                let iconName;
    
                if (route.name === 'Inventory') {
                    iconName = focused
                    ? 'water'
                    : 'water-outline';
                } else if (route.name === 'Settings') {
                    iconName = focused ? 'ios-settings' : 'ios-settings';
                }
    
                // You can return any component that you like here!
                return <Icon name={iconName} size={size} color={color} />;
                },
            })}
            tabBarOptions={{
                activeTintColor: '#34C759',
                inactiveTintColor: 'gray',
            }}
        >
            <Tabs.Screen name='Inventory' component={InventoryStack}/>
            <Tabs.Screen name='Settings' component={SettingsStack} options={{ title: "Settings"}}/>
        </Tabs.Navigator>
    );
};

const styles = StyleSheet.create({
    center:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: '#34C759',
      },
      buttonText: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
      },
});