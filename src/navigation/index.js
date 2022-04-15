import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {LoginScreen} from '../screens/LoginScreen'
import { Init } from '../redux/store/actions'
import { useDispatch, useSelector } from 'react-redux';
import { Appbar, Menu } from 'react-native-paper';
import  SettingsScreen  from '../screens/SettingsScreen'
import DashboardScreen from '../screens/DashboardScreen'

const Stack = createNativeStackNavigator();

const NavigationBar = ({navigation, back}) => {
    const [menuVisible, setMenuVisible] = useState(false);
    const openMenu = () => setMenuVisible(true); 
    const closeMenu = () => setMenuVisible(false);
  
    
    useEffect(() => {
        return closeMenu();    
    }, []);

    return(
        <Appbar.Header>
            {back ? <Appbar.BackAction onPress={navigation.goBack}/> : null}
            <Appbar.Content title="Tech Support"/>
            <Menu 
                visible={menuVisible}
                onDismiss={closeMenu}
                anchor={
                    <Appbar.Action icon="menu" color="white" onPress={openMenu}/>
                }
            >
            <View style={{ flex: 1 }}>
                <Menu.Item onPress={() => {
                    navigation.push("Settings");
                    closeMenu();
                }} title="Settings" />
                <Menu.Item title="About {not yet :D}"/>
            </View>
            </Menu>
        </Appbar.Header>
    )
} 

export const AuthStack = (props) => {
    return(
        <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
                header: (props) => <NavigationBar {...props}/>,
            }}
        >
            <Stack.Screen name="Login" component={LoginScreen}/>
            <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
    );
}

export const AppStack = (props) => {
    return(
        <Stack.Navigator>
            <Stack.Screen name="Dashboard" component={DashboardScreen}/>
        </Stack.Navigator>
    )
}

const RootNavigator = (props) => {
    const token = useSelector(state => state.AuthReducer.authToken)
    const dispatch = useDispatch();
    const init = () => {
        dispatch(Init());
    }

    useEffect(() => {
        init()
    }, []);

  return (
    
    <NavigationContainer>
        {
            token === null ?
            <AuthStack/> : <AppStack/>
        }
    </NavigationContainer>
  );
}

export default RootNavigator;
