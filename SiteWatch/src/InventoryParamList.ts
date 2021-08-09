import { StackNavigationProp } from "@react-navigation/stack";

import {RouteProp} from "@react-navigation/native";

export type InventoryParamList = {
    Hello: undefined; 
    Bye: undefined;
    Users: undefined;
};
export type Data  = {
    id: number;
    description: string;
    gallons: number;
    inches: number;
    volume: number;
    height: number;
    max_volume: number;
    min_volume: number;
    readDate: string;
    locationID: number;
    territoryID: number;
  }

export type InventoryStackNavProps<T extends keyof InventoryParamList> = {
    navigation: StackNavigationProp<InventoryParamList, T>;

    route: RouteProp<InventoryParamList, T>;


}

