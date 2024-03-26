import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import PushNotification from 'react-native-push-notification';
import SplashScreen from 'react-native-splash-screen';
import Toast from 'react-native-toast-message';
import useMinttiVision from './src/nativemodules/MinttiVision/useMinttiVision.ts';
import AppNavigation from './src/utils/AppNavigation';

export const queryClient = new QueryClient();

export default function App() {
  const mittiVision = useMinttiVision({});
  const createNotificationChannels = () => {
    PushNotification.createChannel(
      {
        channelId: 'meeting-channel',
        channelName: 'meeting_channel',
      },
      result => {},
    );
  };

  useEffect(() => {
    createNotificationChannels();
    if (Platform.OS === 'android') SplashScreen.hide();
  }, []);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <QueryClientProvider client={queryClient}>
        <AppNavigation />
      </QueryClientProvider>
      <Toast />
    </GestureHandlerRootView>
  );
}
