import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppointmentMeeting from '../screens/AppointmentMeeting';
import DeviceInitialization from '../screens/DeviceInitialization';
import Home from '../screens/Home';
import Login from '../screens/Login';
import { useloggedInStore } from './store/useLoggedIn';

export type HomeStackNavigatorParamList = {
  Home: undefined;
  DeviceInitialization: {
    testName: string;
  };
  LiveMeeting: undefined;
  Login: undefined;
};

const Stack = createNativeStackNavigator<HomeStackNavigatorParamList>();

export default function AppNavigation() {
  const loggedIn = useloggedInStore(state => state.loggedIn);
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          {loggedIn ? (
            <>
              <Stack.Screen
                name="Home"
                options={{headerShown: false}}
                component={Home}
              />
              <Stack.Screen
                name="DeviceInitialization"
                component={DeviceInitialization}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="LiveMeeting"
                component={AppointmentMeeting}
                options={{headerShown: false}}
              />
            </>
          ) : (
            <Stack.Screen
              name="Login"
              options={{headerShown: false}}
              component={Login}
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
