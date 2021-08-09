import AsyncStorage from '@react-native-community/async-storage';
import React from 'react'
import { KeyboardAvoidingView, Platform, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { setAccessToken } from '../accessToken';
import {AuthContext} from '../AuthProvider';
import { MeDocument, MeQuery, useLoginMutation } from '../generated/graphql';
interface LoginProps {

}

export const Login: React.FC<LoginProps> = ({}) => {
    const [email, onChangeUsername] = React.useState(null);
    const [password, onChangePassword] = React.useState(null);

    const { getToken } = React.useContext(AuthContext);

    const [login, loading] = useLoginMutation();
    
    return(
        <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.container}>
            <Text style={styles.welcomeText}> Welcome </Text> 
            <View>
                <Text style={{marginLeft:7}}>Username</Text>
                <TextInput 
                    style={styles.input}
                    onChangeText={onChangeUsername}
                    value={email}
                    placeholder="Username"
            
                />   

            </View>
            <View>
                <Text style={{marginLeft:7}}>Password</Text>
                <TextInput 
                    style={styles.input}
                    onChangeText={onChangePassword}
                    value={password}
                    placeholder="Password"
                    secureTextEntry = {true}
            
                />
            </View>

            <TouchableOpacity style={styles.button} onPress = {async() => {
                console.log("form submitted");
                const response = await login({
                  variables: {
                    email,
                    password
                  },
                  update: (store, { data }) => {
                    if (!data) {
                      return null;
                    }
        
                    store.writeQuery<MeQuery>({
                      query: MeDocument,
                      data: {    
                        me: data.login.user
                      }
                    });
                    
                    console.log('here')
                    return data.login.user;
                  }
                });
                if( response.data!.login.accessToken !== '{"_U": 0, "_V": 0, "_W": null, "_X": null}'){
                  AsyncStorage.setItem("user", response.data!.login.accessToken);
                }
                if (response && response.data) {
                  setAccessToken(response.data.login.accessToken);
                }
                
                getToken(response.data!.login.accessToken);
                
            }} >
                <Text style={styles.buttonText}>Log In</Text>
            </TouchableOpacity>
        </ View>
            </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
 
    container:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    welcomeText:{
        fontSize: 50,
        marginBottom: 20,
        fontWeight: 'bold'

    },
    input:{
        //paddingVertical: 15,
        paddingHorizontal: 24,
        borderColor: '#B9C4CA',
        borderRadius: 25,
        width: 300,
        marginBottom: 12,
        marginTop: 6,
        fontFamily: 'Avenir-Medium',
        fontSize: 16,
        backgroundColor: '#B9C4CA',
        color: 'black',
        height: 45,
        borderWidth: 1,
        
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 12,
        elevation: 3,
        backgroundColor: 'lightgreen',
        marginTop: 15,
      },
      buttonText: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
      },

});
