import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
} from 'react-native';

import HomeScreen from './src/screens/HomeScreen'

const App = () => {
  return (
    <SafeAreaView>
      <StatusBar />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <HomeScreen />
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;
