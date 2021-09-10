import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
} from 'react-native';
import store from './src/redux/store';
import { Provider } from 'react-redux';

import HomeScreen from './src/screens/HomeScreen'

const App = () => {

  return (
    <Provider store={store}>
      <SafeAreaView>
        <StatusBar />
        <HomeScreen />
      </SafeAreaView>
    </Provider>
  );
};

export default App;
