import React, { useState } from "react";
import { Alert, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { AuthContext } from "../src/AuthProvider";

export function Settings() {

    const [levelChangeIsEnabled, setlevelChangeIsEnabled] = useState(false);
    const toggleLevelChangeSwitch = () => {
        setlevelChangeIsEnabled(previousState => !previousState)
        console.log(levelChangeIsEnabled)
    };
    const [highLevelIsEnabled, setHighLevelIsEnabled] = useState(false);
    const toggleHighLevelSwitch = () => {
        setHighLevelIsEnabled(previousState => !previousState)
        console.log(highLevelIsEnabled)
    };
    const [lowLevelIsEnabled, setLowLevelIsEnabled] = useState(false);
    const toggleLowLevelSwitch = () => {
        setLowLevelIsEnabled(previousState => !previousState)
        console.log(lowLevelIsEnabled)
    };
    const [timeoutIsEnabled, setTimeoutIsEnabled] = useState(false);
    const toggleTimeoutSwitch = () => {
        setTimeoutIsEnabled(previousState => !previousState)
        console.log(timeoutIsEnabled)
    };

    const createTwoButtonAlert = () =>
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to log out of this account?",
      [
        { text: "Logout", onPress: () => {logout();} },
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        
      ]
    );

    const {logout} = React.useContext(AuthContext)
    return(
        <View style= {styles.center}>
            <Text style={{marginRight: 175, marginBottom:20, fontWeight:'bold', fontSize:16}}>Notification Settings</Text>
            <View style= {{flexDirection: 'row'}}>
                <Text style={{marginRight: 175,  marginBottom:15}}>Level Change</Text>
                <Switch
                    trackColor={{ false: "#767577", true: "#34C759" }}
                    thumbColor={levelChangeIsEnabled ? "white" : "white"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleLevelChangeSwitch}
                    value={levelChangeIsEnabled}
                />
            </View>
            <View style= {{flexDirection: 'row'}}>
                <Text style={{marginRight: 175,  marginBottom:15}}>High Level</Text>
                <Switch
                    trackColor={{ false: "#767577", true: "#34C759" }}
                    thumbColor={highLevelIsEnabled ? "white" : "white"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleHighLevelSwitch}
                    value={highLevelIsEnabled}
                />
            </View>
            <View style= {{flexDirection: 'row'}}>
                <Text style={{marginRight: 175,  marginBottom:15}}>Low Level</Text>
                <Switch
                    trackColor={{ false: "#767577", true: "#34C759" }}
                    thumbColor={lowLevelIsEnabled ? "white" : "white"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleLowLevelSwitch}
                    value={lowLevelIsEnabled}
                />
            </View>
            <View style= {{flexDirection: 'row'}}>
                <Text style={{marginRight: 175,  marginBottom:15}}>Timeout</Text>
                <Switch
                    trackColor={{ false: "#767577", true: "#34C759" }}
                    thumbColor={timeoutIsEnabled ? "white" : "white"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleTimeoutSwitch}
                    value={timeoutIsEnabled}
                />
            </View>
            <Text style={{marginRight: 175, marginBottom:20, fontWeight:'bold', fontSize:16}}>Account Settings</Text>
            <TouchableOpacity style={styles.button} onPress = {() => {createTwoButtonAlert()}} >
                <Text style={styles.buttonText}>Log Out</Text>
            </TouchableOpacity>
        </View>
    )
}
const styles = StyleSheet.create({
    center:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: '#34C759',
      },
      buttonText: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
      },
});