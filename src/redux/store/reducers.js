const initialState = {
    authToken: null,
    userData: {
        username: null,
        password: null
    },
}

const initialServerState = {
    address: "0.0.0.0",
}

export const AuthReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state, //copies all data
                authToken: action.payload,
                userData: {
                    username: action.username, 
                    password: action.password,
                }
            }
        case 'LOGOUT':
            return {
                ...initialState
            }
        default: 
            return state;

    }
}

export const SettingsReducer = (state = initialServerState, action) => {
    switch (action.type) {
        case 'SET_ADDR':
            return {
                address: action.payload
            }
        default:
            return state;
    }
}