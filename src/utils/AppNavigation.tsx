import {NavigationContainer} from '@react-navigation/native';

import {createDrawerNavigator} from '@react-navigation/drawer';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AppointmentDetail from '../screens/AppointmentDetail';
import CustomDrawer from '../components/CustomDrawer';
import AboutApp from '../screens/AboutApp';
import BloodGlucose from '../screens/BloodGlucose';
import BloodOxygen from '../screens/BloodOxygen';
import BloodPressure from '../screens/BloodPressure';
import BodyTemperature from '../screens/BodyTemperature';
import DeviceInitalization from '../screens/DeviceInitalization';
import ECG from '../screens/ECG';
import Home from '../screens/Home';
import Instructions from '../screens/Instrunctions';
import Login from '../screens/Login';
import {useSignInStore} from './store/useSignInStore';
import AppointmentHistory from '../screens/AppointmentHistory';

export type HomeStackNavigatorParamList = {
  Home: undefined;
  Login: undefined;
  AppointmentDetail: {
    id: string;
  };
  Intructions: {
    testType: string;
  };
  DeviceInitialization: {
    testRoute: string;
  };
  AboutApp: undefined;
  BloodGlucose: undefined;
  BloodOxygen: undefined;
  BodyTemperature: undefined;
  BloodPressure: undefined;
  ECG: undefined;
  History: undefined;
};

const Drawer = createDrawerNavigator<HomeStackNavigatorParamList>();
const Stack = createNativeStackNavigator<HomeStackNavigatorParamList>();

export const navigationRef = React.createRef<any>();

export function navigate(name: string, params: any) {
  navigationRef.current?.navigate(name, params);
}

export default function AppNavigation() {
  const {userData} = useSignInStore();

  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef}>
        {userData ? (
          <>
            <Drawer.Navigator
              drawerContent={props => <CustomDrawer {...props} />}>
              <Drawer.Screen
                name="Home"
                options={{headerShown: false}}
                component={Home}
              />
              <Drawer.Screen
                name="AppointmentDetail"
                component={AppointmentDetail}
                options={{headerShown: false}}
              />
              <Drawer.Screen
                name="Intructions"
                component={Instructions}
                options={{headerShown: false}}
              />
              <Drawer.Screen
                name="AboutApp"
                component={AboutApp}
                options={{headerShown: false}}
              />
              <Drawer.Screen
                name="DeviceInitialization"
                component={DeviceInitalization}
                options={{headerShown: false}}
              />
              <Drawer.Screen
                name="BloodOxygen"
                component={BloodOxygen}
                options={{headerShown: false}}
              />
              <Drawer.Screen
                name="BloodPressure"
                component={BloodPressure}
                options={{headerShown: false}}
              />
              <Drawer.Screen
                name="BloodGlucose"
                component={BloodGlucose}
                options={{headerShown: false}}
              />
              <Drawer.Screen
                name="BodyTemperature"
                component={BodyTemperature}
                options={{headerShown: false}}
              />
              <Drawer.Screen
                name="ECG"
                component={ECG}
                options={{headerShown: false}}
              />
              <Drawer.Screen
                name="History"
                component={AppointmentHistory}
                options={{headerShown: false}}
              />
            </Drawer.Navigator>
          </>
        ) : (
          <Stack.Navigator>
            <Stack.Screen
              name="Login"
              options={{headerShown: false}}
              component={Login}
            />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
