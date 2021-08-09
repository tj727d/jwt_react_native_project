import React from 'react';
import {View, ActivityIndicator, StyleSheet,} from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from '@react-native-community/async-storage';
import {AuthContext} from './AuthProvider'
import { AppTabs } from './AppTabs';
import { AuthStack } from './AuthStack';

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

    var userToken: string;

    const getData = async () => {
        setLoading(true);
        try {
            const value = await AsyncStorage.getItem('user')
            if(value !== null) {

                console.log(`Value -> ${value}`)

                userToken = value;
                setAccessToken(userToken)

                getToken(value);
                if (user != null){
                  await console.log(user)
                }

              //make graphql request for user
              setLoading(false);
                
            }
        } catch(e) {
        // error reading value
            console.log(e.message);
            setLoading(false);
        }
        await console.log('use me', userToken)
        

        


    }
    

    const cache = new InMemoryCache({});

    const requestLink = new ApolloLink(
      (operation, forward) =>
        new Observable(observer => {
          let handle: any;
          Promise.resolve(operation)
            .then( operation => {
              //getData();
              const accessToken = getAccessToken();
              console.log("access token set", accessToken)
              if (accessToken !== "") {
                operation.setContext({
                  headers: {
                    authorization: `bearer ${accessToken}`
                  }
                });
              }
              else if (accessToken === ""){
                
                console.log('afnbsdok;ljfbgnas   ')
                operation.setContext(async () => {
                  headers: {
                    authorization: `bearer ${await AsyncStorage.getItem('user')}`
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
          isTokenValidOrUndefined:  () => {


            var token = getAccessToken();
            console.log("isTokenValidOrUndefined ", user)
            if (!token || token == "") {
              console.log("no token")

                return true;
            }

            try {
              console.log('jwt refresh', jwtDecode(user!))
              const {exp}: any = jwtDecode(user!);
              if (Date.now() >= exp * 1000) {
                console.log(user!)
                console.log("jwt refresh false")
                return false;
                
              } else {
                console.log("jwt refresh true")
                return true;
                
              }
            } catch(e) {
            console.log(e.message)
              return false;
            }
          },
          fetchAccessToken: () => {
            console.log("fetchAccessToken")
            return fetch("http://localhost:4000/refresh_token", {
              method: "POST",
              credentials: "include",
        
            });
          },
          handleFetch: accessToken => {
            console.log('handleFetch')
            if (accessToken){
              console.log('accessToken exists true')
              setAccessToken(accessToken)
              AsyncStorage.setItem("user", accessToken);
              getToken(accessToken)
              console.log("handleFetch accessToken: ",accessToken)
            }
          },
          handleError: err => {
            console.log(user)
            console.warn("Your refresh token is invalid. Try to re-login");
            console.error(err);
          }
        }),
        onError(({ graphQLErrors, networkError, operation, forward}) => {


            console.log('errror \n');
            console.log(graphQLErrors, "hiedsughi");
            console.log(networkError);
  
            return new Observable(observer => {
                const value = AsyncStorage.getItem('user')
                .then(() => {
                  console.log(`${value}`)
                  if (value !== null){
                    setAccessToken(`${value}`)
                  }
                  operation.setContext(({ headers = {} }) => ({
                    headers: {
                      // Re-add old headers
                      ...headers,
                      // Switch out old access token for new one
                      authorization: `Bearer ${value}` || null,
                    }
                  }));
                })
                .then(() => {
                  const subscriber = {
                    next: observer.next.bind(observer),
                    error: observer.error.bind(observer),
                    complete: observer.complete.bind(observer)
                  };
  
                  // Retry last failed request
                  forward(operation).subscribe(subscriber);
                })
                .catch(error => {
                  // No refresh or client token available, we force user to login
                  observer.error(error);
                });
            });
  
          }),
        requestLink,
        new HttpLink({
          uri: "http://localhost:4000/graphql",
          credentials: "include"
        })
      ]),
      cache
    });

    React.useEffect(()=>{

        getData();
        console.log(user,'lllllllll')
        setLoading(false);

    //     fetch("http://localhost:4000/refresh_token", {
    //     method: "POST",
    //     credentials: "include"
    //   }).then(async x => {
    //     console.log(x.json())
    //     const { accessToken } = await x.json();
    //     console.log(x.json(), "this is x.json")
    //     setAccessToken(accessToken);
    //     console.log('user',user)
    //     console.log('saved token',accessToken)
    //     if (accessToken !== (user) && accessToken != ("") && accessToken != {"_U": 0, "_V": 0, "_W": null, "_X": null}){
    //         console.log('saving user')
    //         AsyncStorage.setItem("user", accessToken);
    //         getToken(accessToken)
    //     }
    //     setLoading(false);
    //   })
    //   .catch(e => {
    //       console.log(e.message, "refresh error")
    //   })
      

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
})

