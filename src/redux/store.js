import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from "redux-thunk"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer, } from 'redux-persist';

import index from './reducers/index';

const homeStorage = {
    key: "home",
    storage: AsyncStorage
}

const rootReducer = combineReducers(
    {
        home: persistReducer(homeStorage, index)
    }
);

export const store = createStore(rootReducer, applyMiddleware(thunk));
export const persistor = persistStore(store);