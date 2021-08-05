import React from 'react'
import {createStackNavigator} from '@react-navigation/stack';
import {Login} from './screens/Login'
import { AuthParamList } from './AuthParamList';
interface AuthStackProps {

}

const Stack = createStackNavigator<AuthParamList>()

export const AuthStack: React.FC<AuthStackProps> = ({}) => {
    return (                    
    <Stack.Navigator >
        <Stack.Screen 
        name="Login" 
        component={Login}
        options={{
            header: () => null,
        }}
        />
    </Stack.Navigator>);
};