import React, {useCallback, useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  Modal,
  Pressable,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import useSaveTestResults from '../api/action/useSaveTestResult';
import CustomTextRegular from '../components/ui/CustomTextRegular';
import CustomTextSemiBold from '../components/ui/CustomTextSemiBold';
import useMinttiVision from '../nativemodules/MinttiVision/useMinttiVision';
import {meetingStyles} from '../styles/style';
import {useAppointmentDetailStore} from '../utils/store/useAppointmentDetailStore';
import {useMinttiVisionStore} from '../utils/store/useMinttiVisionStore';
import Button from '../components/ui/Button';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {HomeStackNavigatorParamList} from '../utils/AppNavigation';
import {queryClient} from '../../App';

type BloodOxygenProps = NativeStackScreenProps<
  HomeStackNavigatorParamList,
  'BodyTemperature'
>;

const dimensions = Dimensions.get('window');

export default function BodyTemperature({navigation}: BloodOxygenProps) {
  const [showModal, setShowModal] = useState(false);
  const {appointmentDetail, appointmentTestId} = useAppointmentDetailStore();
  const {mutate, isPending} = useSaveTestResults();
  const {measureBodyTemperature} = useMinttiVision({});
  const {temperature, setTemperature, isConnected, battery, isMeasuring} =
    useMinttiVisionStore();

  // Reset Values
  useEffect(() => {
    setTemperature(0);
  }, []);

  function toggleModal(status: boolean) {
    setShowModal(status);
  }

  const CustomDrawer = useCallback(() => {
    function saveResult() {
      mutate(
        {
          AppointmentTestId: appointmentTestId!,
          VariableName: ['Temperature'],
          VariableValue: [temperature + ' ℃'],
        },
        {
          onError: () => {
            ToastAndroid.show('Whoops! Something went wrong', 5000);
          },
          onSuccess: () => {
            toggleModal(false),
              setTemperature(0),
              Toast.show({
                type: 'success',
                text1: 'Save Result',
                text2: 'Body temperature result saved successfully. 👍',
              });
            queryClient.invalidateQueries({
              queryKey: [
                `get_appointment_details_${appointmentDetail?.AppointmentId}`,
              ],
            }),
              navigation.navigate('AppointmentDetail', {
                id: appointmentDetail?.AppointmentId!,
              });
          },
        },
      );
    }

    function reTakeTesthandler() {
      setTemperature(0);
      setShowModal(false);
    }
    return (
      <Modal
        visible={
          showModal &&
          navigation.getState().routes[navigation.getState().index].name ===
            'BodyTemperature'
        }
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          toggleModal(false);
        }}>
        <Pressable
          onPress={() => toggleModal(false)}
          className="w-full h-full bg-black opacity-25"></Pressable>
        <View
          style={{
            ...meetingStyles.modal,
            height: '65%',
          }}
          className="p-4 bg-white">
          <View className="flex-row items-center justify-between w-full mb-auto">
            <CustomTextSemiBold className="mx-auto text-lg font-semibold text-text">
              Test Result
            </CustomTextSemiBold>
          </View>
          <View className="flex-1 mt-4">
            <View className="flex-1 my-auto">
              <View className="flex-row items-center">
                <View className="p-2 rounded-full bg-primmary">
                  <Image
                    className="w-5 h-5"
                    source={require('../assets/icons/devices/temperature.png')}
                  />
                </View>
                <CustomTextSemiBold className="ml-4 text-lg text-primmary">
                  Body Temperature
                </CustomTextSemiBold>
              </View>
              <View className="mt-4">
                <View className="flex-row items-center">
                  <CustomTextSemiBold className="text-text">
                    Body temperature
                  </CustomTextSemiBold>
                  <CustomTextRegular className="ml-2 text-gray-600">
                    {temperature} ℃
                  </CustomTextRegular>
                </View>
              </View>
              <CustomTextRegular className="mt-4 text-text">
                By pressing "Save Result", your test results will be securely
                saved and will be shared with{' '}
                {appointmentDetail?.doctor.Firstname}{' '}
                {appointmentDetail?.doctor.Lastname} for your upcoming
                appointment on {appointmentDetail?.AppointmentDate}. If you
                wish, you have the option to retake the test in case you are not
                satisfied with the results.
              </CustomTextRegular>
              <View className="flex flex-row justify-end mt-auto">
                <TouchableOpacity
                  onPress={reTakeTesthandler}
                  className="px-4 py-2 border rounded-md border-text">
                  <CustomTextRegular className="text-center text-text">
                    Retake Test
                  </CustomTextRegular>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => saveResult()}
                  disabled={isPending}
                  className="px-4 py-2 ml-2 border rounded-md bg-primmary border-primmary">
                  <CustomTextRegular className="text-center text-white">
                    {isPending ? 'Saving...' : 'Save Result'}
                  </CustomTextRegular>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  }, [showModal]);

  async function measureTemperature() {
    await measureBodyTemperature();
    setShowModal(true);
  }

  return (
    <>
      <View className="flex-1 px-5 bg-white">
        <View className="flex-row items-center py-5">
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.goBack()}
            className="p-1">
            <Image
              source={require('../assets/icons/back_arrow.png')}
              alt="Go back"
            />
          </TouchableOpacity>
          <CustomTextRegular className="mx-auto text-xl text-text">
            Body Temperature
          </CustomTextRegular>
        </View>

        {/* Result here */}
        <View className="items-center justify-between p-4 border border-gray-300 rounded-md">
          <View className="items-center mx-auto">
            <CustomTextRegular className="mb-4 text-center text-text">
              Body Temperature
            </CustomTextRegular>
            <View className="flex-row items-end">
              <CustomTextRegular className="text-3xl text-text">
                {temperature ? String(temperature) : 0}
              </CustomTextRegular>
              <CustomTextRegular className="text-xs text-text">
                ℃
              </CustomTextRegular>
            </View>
          </View>
        </View>

        {/* Noraml Temperature here */}
        <View className="p-4 mt-4 border border-gray-300 rounded-md">
          <Image
            style={{
              width: dimensions.width * 0.8,
              marginHorizontal: 'auto',
              objectFit: 'contain',
            }}
            source={require('../assets/images/normal_temperature.png')}
            alt="normal oxygen level"
          />
        </View>

        <View className="flex flex-row justify-between mt-10">
          <View
            className={`flex flex-row items-center px-4 py-2 mr-auto rounded-full ${
              isConnected ? 'bg-primmary' : 'bg-rose-400'
            }`}>
            <Image
              className="w-3 h-3"
              source={
                isConnected
                  ? require('../assets/icons/bluetooth.png')
                  : require('../assets/icons/bluetooth-off.png')
              }
              alt="Connection status"
            />
            <CustomTextSemiBold className={`ml-2 text-xs text-white`}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </CustomTextSemiBold>
          </View>
          <View className="flex flex-row items-center px-4 py-2 rounded-full bg-primmary">
            <CustomTextSemiBold className="ml-2 text-xs text-white">
              Battery: {battery}%
            </CustomTextSemiBold>
          </View>
        </View>
        <Button
          text={isMeasuring ? 'Measuring' : 'Start Test'}
          className="mt-auto mb-5"
          disabled={isMeasuring}
          onPress={() => measureTemperature()}
        />
      </View>
      <CustomDrawer />
    </>
  );
}
