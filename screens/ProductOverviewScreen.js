import React, {useEffect, useState, useCallback} from 'react';
import {View, Button, FlatList, Platform, StyleSheet, ActivityIndicator, Text} from 'react-native';
import { HeaderButtons, Item} from 'react-navigation-header-buttons';
import {useSelector, useDispatch} from 'react-redux'

import ProductItem from '../components/shop/ProductItem';
import HeaderButton from '../components/HeaderButton';
import * as cartActions from '../store/actions/cartA';
import * as productActions from '../store/actions/productsA'
import Colors from '../constants/Colors';

const ProductOverviewScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  const products = useSelector(state => state.products.availableProducts);
  const dispatch = useDispatch();

  const loadProducts = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try { 
      await dispatch(productActions.fetchProducts());
    } catch (err){
      setError(err.message);
    }    
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    const willFocusSub = props.navigation.addListener('willFocus', loadProducts)

    return () => {
      willFocusSub.remove();
    };
  }, [loadProducts]);

  useEffect(() => {
    setIsLoading(true)
    loadProducts().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, loadProducts])

  const selectItemHandler = (id, title) => {
    props.navigation.navigate('Detail', {
      productId: id,
      productTitle: title,
    });
  };

  if( error ) {
    return (
    <View style={styles.centered}>
      <Text>An error occurred</Text>
      <Button title="Try Again" onPress={loadProducts} color={Colors.primaryColor}/>
    </View>
    )
  }

  if (isLoading) {
    return (
    <View style={styles.centered}>
      <ActivityIndicator size='large' color={Colors.primaryColor}/>
    </View>
    )
  }

  if (!isLoading && products.length === 0) {
    
    return (
      <View style={styles.centered}>
        <Text> No products found. Maybe start adding some</Text>
      </View>
    )
  }

  return ( 
    <FlatList 
      onRefresh={loadProducts}
      refreshing={isRefreshing}
      data={products}
      renderItem={itemData => (
        <ProductItem 
          image={itemData.item.imageUrl} 
          title={itemData.item.title} 
          price={itemData.item.price}
          onSelect={() => {
            selectItemHandler(itemData.item.id, itemData.item.title);
          }}
        >
          <Button color={Colors.secondaryColor} title="Details" onPress={() => {
            selectItemHandler(itemData.item.id, itemData.item.title);
          }}/>
          <Button color={Colors.secondaryColor} title="To Cart" onPress={() => {
            dispatch(cartActions.addToCart(itemData.item));
          }}/>
        </ProductItem>
      )}
    />
  )
};

ProductOverviewScreen.navigationOptions = navData => {

  return {
    headerTitle: "All Products",
    headerLeft: () => <HeaderButtons HeaderButtonComponent={HeaderButton}>
      <Item title="Menu" iconName={Platform.OS === 'android' ? 'md-menu' : "ios-menu"} onPress={() => {navData.navigation.toggleDrawer();
      }}/>
      </HeaderButtons>,
    headerRight: () => <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item title='Cart' 
        iconName={'ios-cart'} 
        onPress={() => {navData.navigation.navigate('Cart')}}
        />
      </HeaderButtons>
  };
};

const styles = StyleSheet.create ({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default ProductOverviewScreen;