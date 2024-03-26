import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React from 'react';
import {Image, StatusBar, View} from 'react-native';
import AppointmentList from '../components/AppointmentList';
import Instruction from '../components/Instruction';
import CustomTextSemiBold from '../components/ui/CustomTextSemiBold';
import {BASE_IMG_URL} from '../utils/config';
import {useSignInStore} from '../utils/store/useSignInStore';
import AppointmentHistory from '../components/AppointmentHistory';

const Tab = createMaterialTopTabNavigator();

export default function Home() {
  const {userData} = useSignInStore();

  return (
    <>
      <View className="flex-1 mx-5">
        <StatusBar backgroundColor="#46b98d" />

        {/* User information  */}
        <View className="relative mt-4 overflow-hidden rounded-lg">
          <Image
            source={require('../assets/images/background.png')}
            className="absolute inset-0 w-full h-full"
            style={{objectFit: 'cover'}}
          />
          <View className="p-3">
            <View className="flex-row items-center justify-between">
              <View>
                <CustomTextSemiBold className="text-lg text-white">
                  Welcome Back
                </CustomTextSemiBold>
                <CustomTextSemiBold className="text-2xl text-white">
                  {`${userData?.Firstname} ${userData?.Lastname}`}
                </CustomTextSemiBold>
              </View>
              <Image
                className="w-16 h-16 rounded-full"
                source={{uri: `${BASE_IMG_URL}${userData?.ProfileImg}`}}
                alt="username"
                style={{objectFit: 'cover'}}
              />
            </View>
            <View className="flex-row items-end justify-between mt-4">
              <View className="max-w-[60%]">
                <CustomTextSemiBold className="mt-1 text-sm text-white">
                  {userData?.Email}
                </CustomTextSemiBold>
              </View>
              <View>
                <CustomTextSemiBold className="mt-1 text-sm text-right text-white">
                  {userData?.Gender === '1' ? 'Male' : 'Female'}
                </CustomTextSemiBold>
                {userData?.Dob && (
                  <CustomTextSemiBold className="mt-1 text-sm text-right text-white">
                    {userData?.Dob}
                  </CustomTextSemiBold>
                )}
              </View>
            </View>
          </View>
        </View>
        <HomeTabs />
      </View>
    </>
  );
}

const HomeTabs = () => {
  return (
    <View className="flex-1 w-full h-full pb-2 mt-5 overflow-hidden rounded-md">
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            position: 'relative',
          },
          tabBarIndicatorStyle: {backgroundColor: '#46b98d'},
          tabBarLabelStyle: {
            fontSize: 12,
            color: '#02200a',
            textTransform: 'capitalize',
            fontFamily: 'Inter-SemiBold',
          },
          tabBarAndroidRipple: {borderless: false},
          tabBarPressColor: 'rgba(0, 0, 0, 0.1)',
        }}>
        <Tab.Screen name="instructions" component={Instruction} />
        <Tab.Screen name="appointment" component={AppointmentList} />
        <Tab.Screen name="history" component={AppointmentHistory} />
      </Tab.Navigator>
    </View>
  );
};
