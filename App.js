import React, { useState } from 'react';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';
import { enableScreens } from 'react-native-screens';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';

import productsReducer from './store/reducers/productsR';
//import ShopNavigator from './navigation/ShopNavigator';
import cartReducer from './store/reducers/cartR';
import ordersReducer from './store/reducers/ordersR';
import authReducer from './store/reducers/authR';
import NavigationConatiner from './navigation/NavigationContainer';


enableScreens();

const rootReducer = combineReducers({
  products: productsReducer,
  cart: cartReducer,
  orders: ordersReducer,
  auth: authReducer
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

const fetchFonts = () => {
  return Font.loadAsync({
    'open-sans' : require('./assets/fonts/OpenSans-Regular.ttf'),
    'open-sans-bold' : require('./assets/fonts/OpenSans-Bold.ttf')
  });
};

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);

  if (!fontLoaded) {
    return (
      <AppLoading 
        startAsync ={fetchFonts} 
        onFinish={() => setFontLoaded(true)}
        onError={console.warn}
        />
    );
  }
  return ( 
    <Provider store={store}>
      <NavigationConatiner />
    </Provider>
  );
}


