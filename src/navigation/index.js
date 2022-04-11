import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {LoginScreen} from '../screens/LoginScreen'
import { Init } from '../redux/store/actions'
import { useDispatch, useSelector } from 'react-redux';

const Stack = createNativeStackNavigator();

export const AuthStack = (props) => {
    return(
        <Stack.Navigator>
            <Stack.Screen name="Login" component={LoginScreen}/>
        </Stack.Navigator>
    );
}

const RootNavigator = (props) => {
    const token = useSelector(state => state.AuthReducers.authToken)
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
            <Text>token is null</Text> : <AuthStack/>
        }
    </NavigationContainer>
  );
}

export default RootNavigator;
