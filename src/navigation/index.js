import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {LoginScreen} from '../screens/LoginScreen'
import { Init } from '../redux/store/actions'
import { useDispatch, useSelector } from 'react-redux';
import { Appbar, Menu } from 'react-native-paper';
import  SettingsScreen  from '../screens/SettingsScreen'
import ProfileScreen from '../screens/ProfileScreen';
import DashboardScreen from '../screens/DashboardScreen'
import TicketCreateScreen from '../screens/TicketCreateScreen';
const Stack = createNativeStackNavigator();

const NavigationBar = ({user, navigation, back}) => {
    const [menuVisible, setMenuVisible] = useState(false);
    const openMenu = () => setMenuVisible(true); 
    const closeMenu = () => setMenuVisible(false);
    const userData = useSelector(state => state.AuthReducer.userData);
    
    useEffect(() => {
        return closeMenu();    
    }, []);

 
    return(
        <Appbar.Header>
            {back ? <Appbar.BackAction onPress={navigation.goBack}/> : null}
            { user? <Appbar.Content></Appbar.Content> : <Appbar.Content title="Tech Support"/>}
            <Menu 
                visible={menuVisible}
                onDismiss={closeMenu}
                anchor={
                    <Appbar.Action icon="menu" color="white" onPress={openMenu}/>
                }
            >
            <View style={{ flex: 1 }}>
                {
                    userData && 
                    <View>
                        <Menu.Item title="Profile" onPress={() => { 
                            navigation.navigate("Profile");
                            closeMenu();
                        }}/>
                        <Menu.Item title="My organisation"/> 
                    </View>
                }
                {
                    (userData && userData.user_type__name === 'admin') &&
                    <View>
                        <Menu.Item title="Add user"/>
                    </View>
                }
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

    const userData = null;

    return(
        <Stack.Navigator
            initialRouteName="Dashboard"
            screenOptions={{
                header: (props) => <NavigationBar user={userData} {...props}/>,
            }}
        >
            <Stack.Screen name="Dashboard" component={DashboardScreen}/>
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="New Ticket" component={TicketCreateScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
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
