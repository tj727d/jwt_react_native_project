import React, {useMemo, useState} from 'react';
import AsyncStorage from '@react-native-community/async-storage';


type UserToken = null | {token: string}
type Permissions = null | {"email": string, "id": number, "locationid": number, "orgid": number, "territoryid": number, "username": string}

export const AuthContext = React.createContext<{
    user: null | string,
    username: null | string,
    password: null | string,
    userPermission: null | Permissions,
    //setUsername: () => void,
    //setPassword: () => void
    login: (username: string, password: string) => void,
    logout: () => void,
    getToken: (user:string) => void,
    getPermissions: (permissions:Permissions) => void
}>({
    user: null,
    username: null,
    password: null,
    userPermission: null,
    //setUsername: () => {},
    //setPassword: () => {},
    login: () => {},
    logout: () => {},
    getToken: () => {},
    getPermissions: () => {}

}); 

interface AuthProviderProps {

}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
    const [user, setUser] = useState<string | null>(null);
    const [permissions, setPermissions] = useState<Permissions | null>(null);

  
    return (
    <AuthContext.Provider 
    value={{
        user,
        userPermission: permissions,
        login: (username: string, password: string) => {
          
        },
        logout: () => {
            AsyncStorage.removeItem("user");
            setUser(null);
        },
        getToken: (value: string )=>{
            
                try {
                console.log(`Value passed: ${value}`)
                setUser(value)
                
                console.log(user)

                } catch(e) {
                  console.log(e.message)
                }

                
        },
        getPermissions: (permission: Permissions)=>{
            
          try {

          console.log(`Value passed: ${permission}`)
          setPermissions(permission)
          console.log(permissions)

          // }
          } catch(e) {
            console.log(e.message)
          }
  },
    }}>
        {children}
    </AuthContext.Provider>
    );
};