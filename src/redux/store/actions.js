export const Init = () => {
     
    return async dispatch => {
        console.log("init fetching..."); 
        const token = "toktok";
   
        dispatch ({
            type: 'LOGIN',
            payload: token,
        });
    }
}

export const Login = (username, password) => {
    return async dispatch => {
        const token = username + ':' + password;
   
        dispatch ({
            type: 'LOGIN',
            payload: token,
        });
    }
}

export const Logout = () => {
    return({
        type: 'LOGOUT',
        payload: null,
    })
}