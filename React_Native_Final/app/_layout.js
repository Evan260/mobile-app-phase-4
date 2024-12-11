import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Calculator from './calc';
import Settings from './settings';
import About from './screen/about';
import AccountScreen from './screen/accountScreen';
import AppearanceScreen from './screen/appearanceScreen';
import Help from './screen/help';
import Privacy from './screen/privacy';
import Login from './login'; 

const Stack = createStackNavigator();

const CalculatorStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="calc"
      component={Calculator}
      options={({ navigation }) => ({
        headerStyle: {
          backgroundColor: 'black',
        },
        headerTintColor: 'white',
        headerTitle: '',
        headerLeft: () => null,
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Icon name="dots-vertical" size={30} color="white" />
          </TouchableOpacity>
        ),
      })}
    />

    <Stack.Screen
      name="Settings"
      component={Settings}
      options={{
        headerStyle: {
          backgroundColor: 'black',
        },
        headerTintColor: 'white',
      }}
    />

    <Stack.Screen
      name="About"
      component={About}
      options={{
        headerStyle: {
          backgroundColor: 'black',
        },
        headerTintColor: 'white',
      }}
    />

    <Stack.Screen
      name="Account"
      component={AccountScreen}
      options={{
        headerStyle: {
          backgroundColor: 'black',
        },
        headerTintColor: 'white',
      }}
    />

    <Stack.Screen
      name="Appearance"
      component={AppearanceScreen}
      options={{
        headerStyle: {
          backgroundColor: 'black',
        },
        headerTintColor: 'white',
      }}
    />

    <Stack.Screen
      name="Help"
      component={Help}
      options={{
        headerStyle: {
          backgroundColor: 'black',
        },
        headerTintColor: 'white',
      }}
    />

    <Stack.Screen
      name="Privacy"
      component={Privacy}
      options={{
        headerStyle: {
          backgroundColor: 'black',
        },
        headerTintColor: 'white',
      }}
    />
  </Stack.Navigator>
);

function _layout() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="CalculatorStack"
        component={CalculatorStack}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default _layout;