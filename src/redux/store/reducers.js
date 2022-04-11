const initialState = {
    authToken: 4,
    userData: {},
}


export default (state = initialState, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state, //copies all data
                authToken: action.payload,
            }
        case 'LOGOUT':
            return {
                ...initialState
            }
        default: 
            return state;

    }
}