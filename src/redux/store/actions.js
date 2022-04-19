import AsyncStorage from "@react-native-async-storage/async-storage";
import {userLogin} from '../../api/apiCalls'
export const Init = () => {
    
    return async dispatch => {
        console.log("init fetching..."); 
        let serverAddress = await AsyncStorage.getItem('server_address');
        const username = await AsyncStorage.getItem("username");   
        const password = await AsyncStorage.getItem('password');
        let userData = null;
        let loginAction = null;
        if(username && password) {
            loginAction = await userLogin(serverAddress, username, password);
        }

        if(loginAction && loginAction.status === 200) {
            userData = {...loginAction.body, password: password};
        }
    
        if(serverAddress) {
            console.log(serverAddress);
            Promise.resolve(
                dispatch({
                    type: 'SET_ADDR',
                    payload: serverAddress,

                })).then(() =>
                    dispatch ({
                        type: 'LOGIN',
                        payload: null,
                        userData: userData ? {...userData, password : password} : null,
                    })
                )
        } else {

            dispatch ({
                type: 'LOGIN',
                payload: null,
            });
        }
    }
}

export const Login = (userData, password) => {
    return async dispatch => {
        await AsyncStorage.setItem('username', userData.username);
        await AsyncStorage.setItem('password', password);
        const token = userData.username + ":" + userData.password;
   
        dispatch ({
            type: 'LOGIN',
            payload: token,
            userData: {...userData, password: password}
        });
    }
}

export const Logout = () => {
    return async dispatch =>  {
        await AsyncStorage.removeItem('username');
        await AsyncStorage.removeItem('password');
     dispatch({
        type: 'LOGOUT',
        payload: null,
        userData: null
     });
    }
}

export const RegisterServer = (address) => {
    return async dispatch => {
        console.log("saving address");
        await AsyncStorage.setItem('server_address', address);
        dispatch({
            type: 'SET_ADDR',
            payload: address,
        });
    }
}