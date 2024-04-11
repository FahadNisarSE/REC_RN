import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import React, {useEffect, useState} from 'react';
import {Alert, Platform} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import SplashScreen from 'react-native-splash-screen';
import Toast from 'react-native-toast-message';
import useMinttiVision from './src/nativemodules/MinttiVision/useMinttiVision.ts';
import AppNavigation from './src/utils/AppNavigation';
import {useMinttiVisionStore} from './src/utils/store/useMinttiVisionStore.ts';
import NetInfo from '@react-native-community/netinfo';
import SpInAppUpdates, {
  StartUpdateOptions,
  IAUUpdateKind,
} from 'sp-react-native-in-app-updates';

export const queryClient = new QueryClient();
const inAppUpdates = new SpInAppUpdates(true);

const checkUpdates = async () => {
  try {
    const result = await inAppUpdates.checkNeedsUpdate();
    if (result.shouldUpdate) {
      let updateOptions: StartUpdateOptions = {};
      if (Platform.OS === 'android') {
        updateOptions = {
          updateType: IAUUpdateKind.FLEXIBLE,
        };
      }
      inAppUpdates.startUpdate(updateOptions);
    }
  } catch (error) {
    console.log('In app update: ', error);
  }
};

export default function App() {
  const [isConnected, setConnected] = useState(true);

  const {setBattery} = useMinttiVisionStore();
  const mittiVision = useMinttiVision({
    onBattery: battery => setBattery(battery.battery),
  });

  useEffect(() => {
    if (Platform.OS === 'android') SplashScreen.hide();
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) setConnected(state.isConnected);
      if (!state.isConnected) {
        showAlert();
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // In app updates
  useEffect(() => {
    checkUpdates();
  }, []);

  const showAlert = () => {
    Alert.alert(
      'Internet Connection',
      'You are offline. Some features may not be available.',
    );
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <QueryClientProvider client={queryClient}>
        <AppNavigation />
      </QueryClientProvider>
      <Toast />
    </GestureHandlerRootView>
  );
}
