import {createStore, createReducers, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk'
import {AuthReducer, SettingsReducer} from './reducers';

const RootReducers = combineReducers({
    AuthReducer,
    SettingsReducer,
});

export const store = createStore(RootReducers, applyMiddleware(thunk));