import {NavigationContainer} from '@react-navigation/native';

import {createDrawerNavigator} from '@react-navigation/drawer';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AppointmentDetail from '../components/AppointmentDetail';
import CustomDrawer from '../components/CustomDrawer';
import AboutUs from '../screens/AboutUs';
import Home from '../screens/Home';
import Login from '../screens/Login';
import {useSignInStore} from './store/useSignInStore';
import DeviceInitalization from '../screens/DeviceInitalization';
import BloodOxygen from '../screens/BloodOxygen';
import BloodPressure from '../screens/BloodPressure';
import BloodGlucose from '../screens/BloodGlucose';
import BodyTemperature from '../screens/BodyTemperature';
import ECG from '../screens/ECG';
import Instructions from '../screens/Instrunctions';
import VisionTestScreen from '../screens/VisionTestScreen';

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
  AboutUs: undefined;
  BloodGlucose: undefined;
  BloodOxygen: undefined;
  BodyTemperature: undefined;
  BloodPressure: undefined;
  ECG: undefined;
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
                name="AboutUs"
                component={AboutUs}
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
