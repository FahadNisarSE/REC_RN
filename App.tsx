import React, {useEffect} from 'react';
import AppNavigation from './src/utils/AppNavigation';
import SplashScreen from 'react-native-splash-screen';
import {Platform} from 'react-native';
import VisionTestScreen from './src/screens/VisionTestScreen.tsx';

export default function App() {
  useEffect(() => {
    if (Platform.OS === 'android') {
      SplashScreen.hide();
    }
  }, []);
  return <VisionTestScreen />;
}
