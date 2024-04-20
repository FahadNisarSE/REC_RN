import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {FlatList, Image, Linking, TouchableOpacity, View} from 'react-native';
import {AppointmentTest} from '../api/schema/Appointment';
import {HomeStackNavigatorParamList} from '../utils/AppNavigation';
import {useAppointmentDetailStore} from '../utils/store/useAppointmentDetailStore';
import {useMinttiVisionStore} from '../utils/store/useMinttiVisionStore';
import CustomTextRegular from './ui/CustomTextRegular';
import CustomTextSemiBold from './ui/CustomTextSemiBold';
import NoRecommendedTests from './ui/NoRecommendedTests';
import {BASE_IMG_URL} from '../utils/config';

const mapTestUrl = (testname: string) => {
  switch (testname) {
    case 'Oxygen Saturation':
      return 'BloodOxygen';
    case 'Blood Pressure':
      return 'BloodPressure';
    case 'Heart Rate':
      return 'ECG';
    case 'Temprature':
      return 'BodyTemperature';
    case 'Respiratory Rate':
      return 'ECG';
    case 'Blood Glucose':
      return 'BloodGlucose';
    default:
      return 'DeviceInitialization';
  }
};

const RECOMMENDED_TESTS_IMAGES: {
  [key: string]: any;
  'Oxygen Saturation': any;
  'Blood Pressure': any;
  'Heart Rate': any;
  Temprature: any;
  'Respiratory Rate': any;
  'Blood Glucose': any;
  'Heart Sound': any;
  'Lung Sound': any;
  'Self Test': any;
} = {
  'Oxygen Saturation': require('../assets/icons/devices/oxygen_level.png'),
  'Blood Pressure': require('../assets/icons/devices/blood_pressure.png'),
  'Heart Rate': require('../assets/icons/devices/blood_pressure.png'),
  Temprature: require('../assets/icons/devices/temperature.png'),
  'Respiratory Rate': require('../assets/icons/devices/lung_wave.png'),
  'Blood Glucose': require('../assets/icons/devices/sugar_level.png'),
  'Heart Sound': require('../assets/icons/devices/blood_pressure.png'),
  'Lung Sound': require('../assets/icons/devices/lung_wave.png'),
  'Self Test': require('../assets/icons/devices/self_assessment.png'),
};

function Item({
  testAttemptable,
  DeviceName,
  PlaystoreLink,
  Result,
  TestName,
  AppointmentTestId,
}: AppointmentTest & {testAttemptable: boolean}) {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackNavigatorParamList>>();
  const {isConnected} = useMinttiVisionStore();

  function onPressHander() {
    if (DeviceName === 'Vital Signs Monitor') {
      useAppointmentDetailStore.setState({
        appointmentTestId: AppointmentTestId,
      });
      // @ts-ignore
      if (isConnected) navigation.navigate(mapTestUrl(TestName));
      else
        navigation.navigate('DeviceInitialization', {
          testRoute: mapTestUrl(TestName),
        });
    } else Linking.openURL(PlaystoreLink);
  }

  return (
    <View className="px-2 py-3 mb-2 bg-white rounded-lg">
      <View className="flex-row items-center">
        <View className="p-2 mr-2 overflow-hidden rounded-xl bg-primmary">
          <Image
            source={
              RECOMMENDED_TESTS_IMAGES[TestName] ??
              require('../assets/icons/devices/self_assessment.png')
            }
            alt={TestName}
            className="w-6 h-6"
            style={{objectFit: 'contain'}}
          />
        </View>
        <View className="flex-1">
          <CustomTextSemiBold className="text-text">
            {TestName}
          </CustomTextSemiBold>
          <CustomTextRegular className="mt-1 text-xs text-text">
            {DeviceName}
          </CustomTextRegular>
        </View>
        {Result || !testAttemptable ? (
          <></>
        ) : (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPressHander}
            className="flex items-center justify-center p-2 my-auto rounded bg-accent">
            <CustomTextRegular className="text-xs text-white">
              {DeviceName === 'Vital Signs Monitor'
                ? 'Start Test'
                : 'Other App'}
            </CustomTextRegular>
          </TouchableOpacity>
        )}
      </View>

      {Result ? (
        <View className="p-2 mt-2 bg-gray-100 rounded-lg">
          {Result.map((result, index) => (
            <View key={index} className="flex">
              {result.Variables?.map((item, itemIndex) =>
                item.VariableName !== 'Self Assessment' ? (
                  <View key={item.VariableName + itemIndex} className="flex-row items-center">
                    <CustomTextRegular className="capitalize text-text">
                      {item.VariableName}:
                    </CustomTextRegular>
                    <CustomTextRegular className="ml-2 text-xs text-text">
                      {item.VariableValue}
                    </CustomTextRegular>
                  </View>
                ) : (
                  <View key={item.VariableName + itemIndex} className="flex">
                    <CustomTextRegular className="capitalize text-text">
                      {item.VariableName}:
                    </CustomTextRegular>
                    <View className="mt-2">
                      <Image
                        source={{uri: BASE_IMG_URL + item.VariableValue}}
                        alt="Self Assessment"
                        className="object-cover w-40 h-40 rounded-lg"
                      />
                    </View>
                  </View>
                ),
              )}
              {result.DoctorComments ? (
                <View className="p-2 mt-4 bg-gray-600 rounded">
                  <CustomTextRegular className="text-white">
                    Doctor Comments: {result.DoctorComments}
                  </CustomTextRegular>
                </View>
              ) : null}
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

export default function RecommendedTestsList() {
  const {appointmentDetail} = useAppointmentDetailStore();

  if (appointmentDetail === undefined) return <></>;

  if (!appointmentDetail || appointmentDetail?.Tests.length === 0)
    return <NoRecommendedTests />;

  const numberofItemHavingResult =
    appointmentDetail?.Tests?.filter(item => item.Result).length || 0;

  const testAttemptable =
    appointmentDetail.AppointmentStatus === 'Accepted' ||
    appointmentDetail.AppointmentStatus === 'On-going' ||
    appointmentDetail.AppointmentStatus === 'Joined';

  return (
    <View className="flex-1 px-4">
      <FlatList
        showsVerticalScrollIndicator={false}
        data={appointmentDetail?.Tests}
        key={appointmentDetail.Tests.length + numberofItemHavingResult}
        keyExtractor={item => item.TestId}
        renderItem={({item}) => (
          <Item {...item} testAttemptable={testAttemptable} />
        )}
      />
    </View>
  );
}
