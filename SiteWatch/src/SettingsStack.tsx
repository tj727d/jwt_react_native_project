import { createStackNavigator } from '@react-navigation/stack';
import React from 'react'
import {Settings} from './screens/SettingsScreen';

import { SettinsParamList } from './SettingsParamList';



interface SettingsStackProps {

}

const Stack = createStackNavigator<SettinsParamList>();

export const SettingsStack: React.FC<SettingsStackProps> = ({}) => { 

    return (
        <Stack.Navigator>
        <Stack.Screen 
          name='Settings' 
          component={Settings}
          options={{
          title: "Settings"
          }}
        />
       
      </Stack.Navigator>


    );

};
