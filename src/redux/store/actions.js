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
                        userData: {
                            "id": 12,
                            "username": "meno",
                            "password": "heslo",
                            "user_type__name": "admin",
                            "full_name": "Patrik Heglas",
                            "phone_number": "0909121212",
                            "created_at": "2022-04-15T12:35:49.322Z",
                            "updated_at": "2022-04-15T12:35:49.323Z",
                            "profile_img_file": null
                        } // TODO: zmenit !!
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
        const token = userData.username + ":" + userData.password;
   
        dispatch ({
            type: 'LOGIN',
            payload: token,
            userData: {...userData, password:"heslo"}
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