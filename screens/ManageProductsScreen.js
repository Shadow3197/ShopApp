import React from 'react';
import { FlatList , Alert, Platform, Button, View, Text} from 'react-native';
import { HeaderButtons, Item} from 'react-navigation-header-buttons';
import { useSelector, useDispatch } from 'react-redux';

import HeaderButton from '../components/HeaderButton'
import ProductItem from '../components/shop/ProductItem';
import Colors from '../constants/Colors';
import * as productsActions from '../store/actions/productsA';

const ManageProductsScreen = props => {
  const userProducts = useSelector(state => state.products.userProducts);
  const dispatch = useDispatch();

  const editProductHandler = (id) => {
    props.navigation.navigate('AddProduct', {productId: id});
  };

  const deleteHandler = (id) => {
    Alert.alert('Are you sure?', 'Do you really want to delete this item', [
      {text: 'No', style: 'default'},
      {text: 'Yes', style: 'destructive', onPress: () => {
        dispatch(productsActions.deleteProduct(id));
        }
      }
    ])
  }

  if (userProducts.length === 0) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>No products found, maybe start creating some?</Text>
      </View>
    )
  }

return ( 
  <FlatList 
    data={userProducts} 
    keyExtractor={item => item.id} 
    renderItem={itemData => (
      <ProductItem 
        image={itemData.item.imageUrl} 
        title={itemData.item.title} 
        price={itemData.item.price}
        onSelect={() => {
          editProductHandler(itemData.item.id)
        }}
      >
        <Button color={Colors.secondaryColor} title="Edit" onPress={() => {
           editProductHandler(itemData.item.id)
          }}/>
          <Button color={Colors.secondaryColor} 
            title="Delete" 
            onPress={deleteHandler.bind(this, itemData.item.id)}
          />
      </ProductItem>
    )}
  />
  );
};

ManageProductsScreen.navigationOptions = navData => {

  return {
    headerTitle: "Products",
    headerLeft: () => <HeaderButtons HeaderButtonComponent={HeaderButton}>
      <Item title="Menu" iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'} onPress={() => {navData.navigation.toggleDrawer();
      }}/>
      </HeaderButtons>,
    headerRight: () => <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item title='Add Product' 
        iconName={Platform.OS === 'android' ? 'md-add-circle-outline' : 'ios-add-circle-outline'} 
        onPress={() => {navData.navigation.navigate('AddProduct')}}
        />
      </HeaderButtons>
  };
};


export default ManageProductsScreen;