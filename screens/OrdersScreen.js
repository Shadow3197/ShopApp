import React, {useEffect, useState} from 'react';
import {View, FlatList , Text, ActivityIndicator, StyleSheet} from 'react-native';
import { HeaderButtons, Item} from 'react-navigation-header-buttons';
import { useSelector, useDispatch } from 'react-redux';

import HeaderButton from '../components/HeaderButton'
import OrderItem from '../components/shop/OrderItem'
import * as ordersActions from '../store/actions/ordersA';
import  Colors  from '../constants/Colors';

const OrdersScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const orders = useSelector(state => state.orders.orders);

  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoading(true);
    dispatch(ordersActions.fetchOrders()).then(() => {
      setIsLoading(false);
    });
  }, [dispatch])

  if (isLoading) {
    return (
      <View styles={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primaryColor}/>
      </View>
    )
  }

  if (orders.length === 0) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>No orders found, maybe start adding some items?</Text>
      </View>
    )
  }

return (
  <FlatList 
    data={orders} 
    keyExtractor={item => item.id}
    renderItem={itemData => (
    <OrderItem 
      amount={itemData.item.totalAmount} 
      date={itemData.item.readableDate}
      items={itemData.item.items}
    />
    )}
  />
)
};

OrdersScreen.navigationOptions = navData => {

  return {
    headerTitle: "Orders",
    headerLeft: () => <HeaderButtons HeaderButtonComponent={HeaderButton}>
      <Item title="Menu" iconName="ios-menu" onPress={() => {navData.navigation.toggleDrawer();
      }}/>
      </HeaderButtons>,
  };
};

const styles = StyleSheet.create ({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default OrdersScreen;