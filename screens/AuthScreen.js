import React, {  useState, useReducer, useCallback, useEffect } from 'react';
import {ScrollView, StyleSheet, View, KeyboardAvoidingView, Button, ActivityIndicator, Alert} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch } from 'react-redux';

import Input from '../components/Input';
import Card from '../components/Card';
import Colors from '../constants/Colors';
import * as authActions from '../store/actions/authA'

const FORM_UPDATE = 'FORM_UPDATE';

const formReducer = (state, action) => {
  if (action.type === FORM_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid
    }
    let updatedFormIsValid = true;
    for (const key in updatedValidities){
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValidities: updatedValidities,
      inputValues: updatedValues
    };
  }
  return state;
};

const AuthScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [isSignUp, setIsSignUp] = useState(false);
  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: '',
      password: ''
    }, 
    inputValidities: {
      email: false,
      password: false
    }, 
    formIsValid: false
  });

  useEffect(() => {
    if(error) {
      Alert.alert('An error Occurred', error, [{text: 'Okay'}]);
    }
  }, [error])

  const authHandler = async () => {
    let action;
    if(isSignUp) {
    action =
      authActions.signup(
        formState.inputValues.email, 
        formState.inputValues.password
        )
    } else {
      action = authActions.login(
        formState.inputValues.email, 
        formState.inputValues.password
        )
    }
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(action);
      props.navigation.navigate('Main')
    } catch (err) {
      setError(err.message)
      setIsLoading(false);
    }
  };
  
  const inputChangeHandler = useCallback((inputIdentifier, inputValue, inputValidity) => {
    dispatchFormState({
      type: FORM_UPDATE, 
      value: inputValue, 
      isValid: inputValidity,
      input: inputIdentifier
    });
  }, [dispatchFormState]);

  return (
    <KeyboardAvoidingView 
      behavior='padding' 
      keyboardVerticalOffset={50} 
      style={styles.screen}>
    <LinearGradient colors={['#a19cf2', '#2a2ad6', '#00d4ff']} style={styles.gradient}>
    <Card style={styles.authContainer}>
      <ScrollView>
        <Input 
          id='email' 
          label="E-Mail" 
          keyboardType="email-address" 
          required 
          email 
          autoCapitalize="none" 
          errorText="Please enter a valid email"
          onInputChange={inputChangeHandler}
          initialValue=""/>
        <Input 
          id='password' 
          label="Password" 
          keyboardType="default" 
          secureTextEntry
          required 
          minLength={6} 
          autoCapitalize="none" 
          errorText="Please enter a valid password"
          onInputChange={inputChangeHandler}
          initialValue=""/>
          <View style={styles.buttonContainer}>
            {isLoading ? ( <ActivityIndicator size="small" color={Colors.primaryColor}/> ) : ( 
            <Button title={isSignUp ? "Sign Up " : "Login"} color={Colors.primaryColor} onPress={authHandler}/>)
          }</View>
          <View style={styles.buttonContainer}>
            <Button title={`Switch to ${isSignUp ? 'Login' : 'Sign Up'}`} 
            color={Colors.accentColor} 
            onPress={()=> {setIsSignUp(prevState => !prevState)}}/>
          </View>
      </ScrollView>
    </Card>
    </LinearGradient>
    </KeyboardAvoidingView>
  );
};

AuthScreen.navigationOptions = () => {
  return {
    headerTitle: 'Authenticate'
  }
}

const styles = StyleSheet.create ({
  screen: {
    flex: 1,
  },
  authContainer: {
    width: '80%',
    maxWidth: 400,
    maxHeight: 400,
    padding: 20
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonContainer: {
    marginTop: 10
  }
})

export default AuthScreen;