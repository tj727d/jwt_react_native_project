import { createStackNavigator } from '@react-navigation/stack';
import React from 'react'
import {InventoryParamList,} from './InventoryParamList'

import { Hello } from './screens/Hello';
import { Bye } from './screens/Bye';
import { Users } from './screens/Users';



interface InventoryStackProps {

}

const Stack = createStackNavigator<InventoryParamList>();

export const InventoryStack: React.FC<InventoryStackProps> = ({}) => { 


    return (

      <Stack.Navigator>
        <Stack.Screen 
          name='Hello' 
          component={Hello}
          options={{
              title: "Hello"
          }}
        />
        <Stack.Screen 
          name='Bye' 
          component={Bye}
          options={{
              title: "Bye"
          }}
        />
        <Stack.Screen 
          name='Users' 
          component={Users}
          options={{
              title: "Users"
          }}
        />


      </Stack.Navigator>

      );
  }