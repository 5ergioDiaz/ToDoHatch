import React, { useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  PermissionsAndroid
} from 'react-native';
import { store } from './src/redux/store';
import { Provider } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeScreen from './src/screens/HomeScreen'

const App = () => {

  // Se piden los permisos para poder acceder a la ubicacion del telefono
  useEffect(() => {
    PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    ]).then(async (resp) => {
      if (
        resp['android.permission.ACCESS_FINE_LOCATION'] &&
        resp['android.permission.ACCESS_COARSE_LOCATION'] === "granted"
      ) {
        await AsyncStorage.setItem("@location_permissions", "true");
      } else if (
        resp['android.permission.ACCESS_FINE_LOCATION'] ||
        resp['android.permission.ACCESS_COARSE_LOCATION'] === "denied"
      ) {
        console.log("DENEGADO")
      } else {
        await AsyncStorage.setItem("@location_permissions", "true");
      }
    })
  }, []);

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
