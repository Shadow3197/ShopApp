import React from 'react';
import { Platform, SafeAreaView, Button, View} from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createDrawerNavigator, DrawerNavigatorItems } from 'react-navigation-drawer';
import {  Ionicons } from '@expo/vector-icons'
import { useDispatch } from 'react-redux'

import ProductOverviewScreen from '../screens/ProductOverviewScreen';
import CartScreen from '../screens/CartScreen';
import DetailScreen from '../screens/DetailScreen';
import OrdersScreen from '../screens/OrdersScreen';
import ManageProductsScreen from '../screens/ManageProductsScreen';
import AddProductScreen from '../screens/AddProductScreen';
import AuthScreen from '../screens/AuthScreen'
import StartUpScreen from '../screens/StartupScreen';
import Colors from '../constants/Colors';
import * as authActions from '../store/actions/authA';

const defaultNavOptions = {
  headerStyle: {
          backgroundColor: Platform.OS === 'android' ? Colors.primaryColor : 'white',
      },
      headerTitleStyle: {
          fontFamily: 'open-sans-bold'
      },
      headerBackTitle: {
          fontFamily: 'open-sans'
      },
      headerTintColor: Colors.primaryColor,
      headerBackTitle: ' '
}

const ShopNavigator = createStackNavigator({
  ProductOverview: ProductOverviewScreen,
  Cart: CartScreen,
  Detail: DetailScreen,
}, {
  navigationOptions: {
    drawerIcon: drawerConfig => <Ionicons 
    name={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
    size={23}
    color={Colors.accentColor}/>
  },
  defaultNavigationOptions: defaultNavOptions
});

const OrderNavigator = createStackNavigator({
  Orders: OrdersScreen,
}, {
  navigationOptions: {
    drawerIcon: drawerConfig => <Ionicons 
    name={Platform.OS === 'android' ? 'md-list' : 'ios-list'}
    size={23}
    color={Colors.accentColor}/>
  },
  defaultNavigationOptions: defaultNavOptions
});

  const ProductNavigator = createStackNavigator({
      ManageProduct: ManageProductsScreen,
      AddProduct :AddProductScreen
  }, {
    navigationOptions: {
      drawerIcon: drawerConfig => <Ionicons 
      name={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
      size={23}
      color={Colors.accentColor}/>
    },
    defaultNavigationOptions: defaultNavOptions
  });

const MainNavigator = createDrawerNavigator({
  Products: { 
    screen: ShopNavigator,
      navigationOptions: {drawerLabel: 'Shopping'}
  },
  Orders: OrderNavigator,
  ManageProducts:{
    screen: ProductNavigator,
      navigationOptions: {drawerLabel: 'Admin'}
  },
}, {
  contentOptions: {
      activeTintColor: Colors.accentColor,
      labelStyle: {
          fontFamily: 'open-sans-bold'
      }
  },
  contentComponent: props => {
        const dispatch = useDispatch();
        return ( 
        <View style={{flex: 1, paddingTop: 20}}>
          <SafeAreaView forceInset={{top: 'always', horizontal: 'never'}}>
            <DrawerNavigatorItems {...props}/>
            <Button title="Logout" color={Colors.primaryColor} onPress={() => {
              dispatch(authActions.logout());
              props.navigation.navigate('Auth');
            }}/>
          </SafeAreaView>
        </View> 
        )
      }
});

const AuthNavigator = createStackNavigator({
  Auth: AuthScreen
}, {
  defaultNavigationOptions: defaultNavOptions
});

const LoginNavigator = createSwitchNavigator({
  Startup: StartUpScreen,
  Auth: AuthNavigator,
  Main: MainNavigator
})

export default createAppContainer(LoginNavigator);