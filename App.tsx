import React, {useEffect} from 'react';
import AppNavigation from './src/utils/AppNavigation';
import SplashScreen from 'react-native-splash-screen';
import {Platform} from 'react-native';

export default function App() {
  useEffect(() => {
    if (Platform.OS === 'android') {
      SplashScreen.hide();
    }
  }, []);
  return <AppNavigation />;
}
