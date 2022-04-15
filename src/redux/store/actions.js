import AsyncStorage from "@react-native-async-storage/async-storage";

export const Init = () => {
    
    return async dispatch => {
        console.log("init fetching..."); 
        const token = "toktok";
        let serverAddress = await AsyncStorage.getItem('server_address');
        if(serverAddress) {
            console.log(serverAddress);
            Promise.resolve(
                dispatch({
                    type: 'SET_ADDR',
                    payload: serverAddress,
                })).then(() =>
                    dispatch ({
                        type: 'LOGIN',
                        username: 'meno',
                        password: 'heslo', // TODO: zmenit !!
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

export const Login = (username, password) => {
    return async dispatch => {
        const token = username + ':' + password;
   
        dispatch ({
            type: 'LOGIN',
            payload: token,
            username: username, 
            password: password
        });
    }
}

export const Logout = () => {
    return({
        type: 'LOGOUT',
        payload: null,
    })
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