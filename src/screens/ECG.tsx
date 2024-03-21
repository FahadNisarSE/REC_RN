import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  Image,
  Modal,
  Pressable,
  ToastAndroid,
  TouchableOpacity,
  View,
  useWindowDimensions,
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
import EcgChart from '../nativemodules/MinttiVision/EcgChart';

type BloodOxygenProps = NativeStackScreenProps<
  HomeStackNavigatorParamList,
  'BodyTemperature'
>;

export default function ECG({navigation}: BloodOxygenProps) {
  const ecgChartRef = useRef();
  const [showModal, setShowModal] = useState(false);
  const {appointmentDetail, appointmentTestId} = useAppointmentDetailStore();
  const {ecg, setECG, isConnected, battery, isMeasuring, setIsMeasuring} =
    useMinttiVisionStore();
  const {measureECG} = useMinttiVision({
    onEcg: event => {
      // @ts-ignore
      ecgChartRef.current?.updateEcgData(event.wave);
    },
    onEcgResult: event => {
      console.log('ecg result: ', event);
      // @ts-ignore
      setECG(event);
    },
  });

  const {mutate, isPending} = useSaveTestResults();

  function toggleModal(status: boolean) {
    setShowModal(status);
  }

  const CustomDrawer = useCallback(() => {
    function saveResult() {
      mutate(
        {
          AppointmentTestId: appointmentTestId!,
          VariableName: [
            'Heart Rate Variablity',
            'RR min',
            'RR max',
            'Average Heart Rate',
            'Respiratory Rate',
          ],
          VariableValue: [
            `${ecg?.heartRate} bpm`,
            `${ecg?.results?.rrMin} ms`,
            `${ecg?.results?.rrMax} ms`,
            `${ecg?.heartRate} bpm`,
            `${ecg?.respiratoryRate} bpm`,
          ],
        },
        {
          onError: () => {
            ToastAndroid.show('Whoops! Something went wrong', 5000);
          },
          onSuccess: () => {
            toggleModal(false),
              setECG(null),
              Toast.show({
                type: 'success',
                text1: 'Save Result',
                text2: 'Blood Pressure result saved successfully. 👍',
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
      setECG(null);
      setShowModal(false);
    }

    return (
      <Modal
        visible={
          showModal &&
          navigation.getState().routes[navigation.getState().index].name ===
            'ECG'
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
                  ECG
                </CustomTextSemiBold>
              </View>
              <View className="mt-4">
                <CustomTextSemiBold className="text-text">
                  ECG
                </CustomTextSemiBold>
                <CustomTextRegular className="ml-2 text-gray-600">
                  Heart Rate: {ecg?.heartRate} bpm
                </CustomTextRegular>
                <CustomTextRegular className="ml-2 text-gray-600">
                  Average Heart Rate: {ecg?.heartRate} bpm
                </CustomTextRegular>
                <CustomTextRegular className="ml-2 text-gray-600">
                  Respiratory Rate: {ecg?.respiratoryRate} bpm
                </CustomTextRegular>
                <CustomTextRegular className="ml-2 text-gray-600">
                  RRI Minimum: {ecg?.results?.rrMin} ms
                </CustomTextRegular>
                <CustomTextRegular className="ml-2 text-gray-600">
                  RRI Maximum: {ecg?.results?.rrMax} ms
                </CustomTextRegular>
                <CustomTextRegular className="ml-2 text-gray-600">
                  HRV: {ecg?.results?.rrMin} ms
                </CustomTextRegular>
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

  async function startECGTest() {
    await measureECG();
  }

  return (
    <>
      <View className="flex-1 bg-white">
        <View className="flex-row items-center py-5 mx-5">
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
            ECG
          </CustomTextRegular>
        </View>

        <EcgChart ref={ecgChartRef} />

        {/* ECG CHART */}
        <View className="items-start justify-between p-4 mx-5 mt-4 border border-gray-200 rounded-md">
          <View>
            <CustomTextRegular className='text-xs text-center text-text'>{JSON.stringify(ecg)}</CustomTextRegular>
            <CustomTextRegular className="text-xs text-left text-text">
              Paper Speed: 25 mm/s
            </CustomTextRegular>
            <CustomTextRegular className="text-xs text-left text-text">
              Gain: 10 mm/mv
            </CustomTextRegular>
          </View>
        </View>

        {/* Result here */}
        <View className="items-center justify-between p-4 mx-5 my-3 border border-gray-200 rounded-md">
          <View className="flex-row">
            <View className="flex-col items-start">
              <CustomTextRegular className="text-xs text-text">
                RRI maximum: {ecg?.results?.rrMax ?? 0} ms
              </CustomTextRegular>
              <CustomTextRegular className="mt-1 text-xs text-text">
                Heart rate: {ecg?.heartRate ?? 0} bpm
              </CustomTextRegular>
              <CustomTextRegular className="mt-1 text-xs text-text">
                Respiratory rate: {ecg?.respiratoryRate ?? 0} bpm
              </CustomTextRegular>
            </View>
            <View className="flex-col items-start ml-4">
              <CustomTextRegular className="text-xs text-text">
                RRI minimum: {ecg?.results?.rrMin ?? 0} ms
              </CustomTextRegular>
              <CustomTextRegular className="mt-1 text-xs text-text">
                HRV: {ecg?.results?.hrv ?? 0} ms
              </CustomTextRegular>
              <CustomTextRegular className="mt-1 text-xs text-text">
                Duration rate: {ecg?.duration?.duration ?? 0} bpm
              </CustomTextRegular>
            </View>
          </View>
        </View>

        <View className="flex flex-row justify-between mx-5 mt-4">
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
          className="mx-5 mt-auto mb-5"
          disabled={isMeasuring}
          onPress={() => startECGTest()}
        />
      </View>
      <CustomDrawer />
    </>
  );
}
