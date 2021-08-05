import React from 'react';
import {View, ActivityIndicator, StyleSheet,} from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
//import { AuthParamList } from './AuthParamList';
import AsyncStorage from '@react-native-community/async-storage';
import {AuthContext} from './AuthProvider'
import { AppTabs } from './AppTabs';
import { AuthStack } from './AuthStack';
import RNLocalize from 'react-native-localize'
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink, ApolloLink, Observable } from '@apollo/client';
import { onError } from "@apollo/client/link/error";
import jwtDecode from 'jwt-decode';
import { TokenRefreshLink } from 'apollo-link-token-refresh';
import { getAccessToken, setAccessToken } from './accessToken';

interface RoutesProps {

}

export const Routes: React.FC<RoutesProps> = ({}) => {
    const { user, getToken} = React.useContext(AuthContext);
    const [loading, setLoading] = React.useState(true);

    const cache = new InMemoryCache({});

    const requestLink = new ApolloLink(
      (operation, forward) =>
        new Observable(observer => {
          let handle: any;
          Promise.resolve(operation)
            .then(async operation => {
              const accessToken = getAccessToken();
              if (accessToken) {
                operation.setContext({
                  headers: {
                    authorization: `bearer ${accessToken}`
                  }
                });
              }
              else if (accessToken == ""){
                const value = await AsyncStorage.getItem('user')
                console.log('afnbsdok;ljfbgnas   ', value)
                operation.setContext({
                  headers: {
                    authorization: `bearer ${value}`
                  }
                });
              }
            })
            .then(() => {
              handle = forward(operation).subscribe({
                next: observer.next.bind(observer),
                error: observer.error.bind(observer),
                complete: observer.complete.bind(observer)
              });
            })
            .catch(observer.error.bind(observer));

          return () => {
            if (handle) handle.unsubscribe();
          };
        })
    );

    const client = new ApolloClient({
      link: ApolloLink.from([
        new TokenRefreshLink({
          accessTokenField: "accessToken",
          isTokenValidOrUndefined: () => {
            const token = getAccessToken();

            if (!token) {
              return true;
            }

            try {
              const {exp}: any = jwtDecode(token);
              if (Date.now() >= exp * 1000) {
                return false;
              } else {
                return true;
              }
            } catch {
              return false;
            }
          },
          fetchAccessToken: () => {
            return fetch("http://localhost:4000/refresh_token", {
              method: "POST",
              credentials: "include"
            });
          },
          handleFetch: async () => {
            const value = await AsyncStorage.getItem('user')
            if(value){ 
              console.log('value here ')
            }
          },
          handleError: err => {
            console.warn("Your refresh token is invalid. Try to relogin");
            console.error(err);
          }
        }),
        onError(({ graphQLErrors, networkError }) => {
          console.log(graphQLErrors);
          console.log(networkError);
        }),
        requestLink,
        new HttpLink({
          uri: "http://localhost:4000/graphql",
          credentials: "include"
        })
      ]),
      cache
    });

    const getData = async () => {
        setLoading(true);
        try {
            const value = await AsyncStorage.getItem('user')
            if(value !== null) {
                // value previously stored
                //logout()
                console.log(`Value -> ${value}`)
                // const token = value;
                console.log(RNLocalize.getTimeZone());
                //setUser(token)
                getToken(value);
                if (user != null){
                  console.log(user)
                }

              //make graphql request for user
              setLoading(false);
                
            }
        } catch(e) {
        // error reading value
            console.log(e.message);
            setLoading(false);
        }
        console.log('use me', user)
        

        setLoading(false);


    }

    React.useEffect(()=>{

        getData();
        
        fetch("http://localhost:4000/refresh_token", {
        method: "POST",
        credentials: "include"
      }).then(async x => {
        const { accessToken } = await x.json();
        setAccessToken(accessToken);
        console.log('user',user)
        console.log('saved token',accessToken)
        if (accessToken !== (user) && accessToken != ("")){
            console.log('saving user')
            AsyncStorage.setItem("user", accessToken);
        }
        setLoading(false);
      });

    }, [])

    if(loading){
        return <View style={styles.center}>
            <ActivityIndicator size ='large'/>
        </View>
    }
    return (
      <ApolloProvider client={client}>
        <NavigationContainer>
            {user ? <AppTabs /> : <AuthStack />}
        </NavigationContainer>
      </ApolloProvider>
        
    );
}

const styles = StyleSheet.create({
    center:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});