import { StackNavigationProp } from "@react-navigation/stack";

import {RouteProp} from "@react-navigation/native";

export type SettinsParamList = {
    Settings: undefined; 
}


export type InventoryStackNavProps<T extends keyof SettinsParamList> = {
    navigation: StackNavigationProp<SettinsParamList, T>;

    route: RouteProp<SettinsParamList, T>;


}

