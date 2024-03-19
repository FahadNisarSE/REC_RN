import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import useGetAppointmentDetails from '../api/query/useGetAppointmentDetails';
import {AppointmentAnswer, AppointmentTest} from '../api/schema/Appointment';
import {HomeStackNavigatorParamList} from '../utils/AppNavigation';
import {BASE_IMG_URL} from '../utils/config';
import {useAppointmentDetailStore} from '../utils/store/useAppointmentDetailStore';
import AppointmentQuestions from './AppointmentQuestions';
import CustomSafeArea from './CustomSafeArea';
import RecommendedTestsList from './RecommendedTestsList';
import CustomTextRegular from './ui/CustomTextRegular';
import CustomTextSemiBold from './ui/CustomTextSemiBold';
import Error from './ui/Error';
import Loader from './ui/Loader';

export type AppointmentDetailTab = {
  'Recom. tests': {appointmentTests: AppointmentTest[]};
  'App. Questions': {appointmentQuestions: AppointmentAnswer[]};
};

const Tab = createMaterialTopTabNavigator<AppointmentDetailTab>();

type AppointmentDetailProps = NativeStackScreenProps<
  HomeStackNavigatorParamList,
  'AppointmentDetail'
>;

export default function AppointmentDetail({
  navigation,
  route,
}: AppointmentDetailProps) {
  const appointmentId = route.params.id;
  const {setAppointmentDetail} = useAppointmentDetailStore();
  const {isLoading, isError, data, refetch} =
    useGetAppointmentDetails(appointmentId);

  useEffect(() => {
    if (data) setAppointmentDetail(data);
  }, [data]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      refetch();
    }, 30000);

    return () => clearInterval(intervalId);
  }, [refetch]);

  if (isLoading) return <Loader size={50} />;

  if (isError) return <Error />;

  return (
    <>
      <CustomSafeArea stylesClass="flex-1">
        <View className="flex-row p-4">
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Image
              source={require('../assets/icons/chevron-left.png')}
              alt="Go back"
              className="w-5 h-5"
            />
          </TouchableOpacity>
          <CustomTextSemiBold className="mx-auto text-xl text-text">
            Appointment Details
          </CustomTextSemiBold>
        </View>
        <View className="p-5 px-5 mx-4 overflow-hidden bg-white rounded-xl">
          {/* Doctor Information */}
          <View className="flex-row items-center">
            <Image
              className="rounded-3xl"
              style={{width: 100, height: '100%'}}
              source={{uri: BASE_IMG_URL + data?.doctor.ProfileImg}}
              alt={`${data?.doctor.Firstname} ${data?.doctor.Lastname}`}
            />
            <View className="flex-1 ml-3">
              <CustomTextSemiBold className="text-lg text-text">
                {`${data?.doctor.Firstname} ${data?.doctor.Lastname}`}
              </CustomTextSemiBold>
              <CustomTextRegular className="max-w-full text-xs capitalize text-text">
                {data?.doctor.SpecialTreatment}
              </CustomTextRegular>

              {/* Appointment Details */}

              <View>
                <CustomTextSemiBold className="mt-2 text-text">
                  Symptoms:
                </CustomTextSemiBold>
                <View className="flex-row flex-wrap" style={{maxWidth: 180}}>
                  <CustomTextRegular className="mt-1 text-xs break-words text-text w-fit">
                    {data?.Symptoms}
                  </CustomTextRegular>
                </View>
              </View>

              <View>
                <CustomTextSemiBold className="mt-2 text-text">
                  Datetime:
                </CustomTextSemiBold>
                <View className="flex-row flex-wrap" style={{maxWidth: 180}}>
                  <CustomTextRegular className="mt-1 text-xs break-words text-text w-fit">
                    {data?.AppointmentDate} | {data?.AppointmentStartTime} -{' '}
                    {data?.AppointmentEndTime}
                  </CustomTextRegular>
                </View>
              </View>
            </View>
          </View>
        </View>
        <AppointmentDetailTabs />
      </CustomSafeArea>
    </>
  );
}

const AppointmentDetailTabs = () => {
  return (
    <View className="flex-1 w-full h-full pb-2">
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            position: 'relative',
            backgroundColor: '#ffffff',
            borderRadius: 10,
            marginHorizontal: 16,
            marginVertical: 10,
            overflow: 'hidden',
            shadowColor: 'rgba(0, 0, 0, 0)',
          },
          tabBarIndicatorStyle: {backgroundColor: '#46b98d'},
          tabBarLabelStyle: {
            fontSize: 14,
            color: '#02200a',
            textTransform: 'capitalize',
            fontFamily: 'Inter-SemiBold',
          },
          tabBarAndroidRipple: {borderless: false},
          tabBarPressColor: 'rgba(0, 0, 0, 0.1)',
        }}>
        <Tab.Screen name="Recom. tests" component={RecommendedTestsList} />
        <Tab.Screen name="App. Questions" component={AppointmentQuestions} />
      </Tab.Navigator>
    </View>
  );
};
