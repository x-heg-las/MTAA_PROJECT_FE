import {createStore, createReducers, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk'
import AuthReducers from './reducers';

const RootReducers = combineReducers({
    AuthReducers,
});

export const store = createStore(RootReducers, applyMiddleware(thunk));