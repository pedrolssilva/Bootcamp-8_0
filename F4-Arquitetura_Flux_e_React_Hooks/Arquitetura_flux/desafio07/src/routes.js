/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Header from './components/Header';

const Routes = createAppContainer(
  createStackNavigator(
    {
      Home,
      Cart,
    },
    {
      headerMode: 'float',
      defaultNavigationOptions: navigation => ({
        gestureEnabled: true,
        header: () => <Header {...navigation} />,
        cardStyle: {
          backgroundColor: '#000',
        },
      }),
    }
  )
);

export default Routes;
