import { StackNavigationProp } from "@react-navigation/stack"

export type AuthParamList = {
    Login: undefined
}

export type AuthNavProps<T extends keyof AuthParamList> = {
    navigation: StackNavigationProp<AuthParamList, T>
}