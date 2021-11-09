import React from 'react';
import { ScrollView, StyleSheet, Image, Text, View, Button } from 'react-native';
import { HeaderButtons, Item} from 'react-navigation-header-buttons';
import { useSelector, useDispatch} from 'react-redux'
import Colors from '../constants/Colors';

import * as cartActions from '../store/actions/cartA'
import HeaderButton from '../components/HeaderButton';

const DetailScreen = props => {
  const productId = props.navigation.getParam('productId');
  const selectedProduct = useSelector(state => state.products.availableProducts.find(prod => prod.id === productId));

  const dispatch = useDispatch();

  return ( 
    <ScrollView>
      <Image style={styles.image} source={{uri: selectedProduct.imageUrl}}/>
      <View style={styles.actions}>
      <Button color={Colors.secondaryColor}title="Add to Cart" onPress={() => {
        dispatch(cartActions.addToCart(selectedProduct));
      }}/>
      </View>
      <Text style={styles.price}>${selectedProduct.price.toFixed(2)}</Text>
      <Text style={styles.desc}> {selectedProduct.description}</Text>
    </ScrollView>
  )
};

DetailScreen.navigationOptions = navData => {

  return {
    headerTitle: navData.navigation.getParam('productTitle'),
    headerRight: () => <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item title='Cart' 
        iconName={'ios-cart'} 
        onPress={() => {navData.navigation.navigate('Cart')}}
        />
      </HeaderButtons>
  };
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    width: '100%',
    height: 300
  },
  price: {
    fontSize: 20,
    color: Colors.secondAccentColor,
    textAlign: 'center',
    marginVertical: 20,
    fontFamily: 'open-sans-bold'
  },
  desc: {
    fontSize: 14,
    textAlign: 'center',
    marginHorizontal: 20,
    fontFamily: 'open-sans'
  },
  actions: {
    marginVertical: 10,
    alignItems: 'center'
  }
});

export default DetailScreen;