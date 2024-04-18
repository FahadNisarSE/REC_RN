import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Alert,
  Image,
  Modal,
  Pressable,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import {queryClient} from '../../App';
import useSaveTestResults from '../api/action/useSaveTestResult';
import BatteryIndicator from '../components/BatteryIndicatory';
import Button from '../components/ui/Button';
import CustomTextRegular from '../components/ui/CustomTextRegular';
import CustomTextSemiBold from '../components/ui/CustomTextSemiBold';
import BoGraph from '../nativemodules/MinttiVision/BoGraph';
import useMinttiVision from '../nativemodules/MinttiVision/useMinttiVision';
import {meetingStyles} from '../styles/style';
import {HomeStackNavigatorParamList} from '../utils/AppNavigation';
import {useAppointmentDetailStore} from '../utils/store/useAppointmentDetailStore';
import {useMinttiVisionStore} from '../utils/store/useMinttiVisionStore';
import {DrawerToggleButton} from '@react-navigation/drawer';
import CustomSafeArea from '../components/CustomSafeArea';

type BloodOxygenProps = NativeStackScreenProps<
  HomeStackNavigatorParamList,
  'BloodOxygen'
>;

export default function BloodOxygen({navigation}: BloodOxygenProps) {
  const bloodOxygenGraphRef = useRef();
  const [showModal, setShowModal] = useState(false);
  const {appointmentDetail, appointmentTestId} = useAppointmentDetailStore();
  const {mutate, isPending} = useSaveTestResults();
  const [spO2Result, setSpO2Result] = useState<
    {heartRate: number; spo2: number} | undefined
  >();
  const {setIsMeasuring, isConnected, battery, isMeasuring} =
    useMinttiVisionStore();
  const {measureBloodOxygen, stopSpo2} = useMinttiVision({
    onSpo2: event => {
      if (event.waveData)
        // @ts-ignore
        bloodOxygenGraphRef?.current?.updateData(event.waveData);
    },
    onSpo2Ended: event => {
      console.log('MEASUREMENT ENDED: ', event);

      if (event.measurementEnded) {
        setIsMeasuring(false);
        toggleModal(true);
      }

      if (event.message) {
      }
    },
    onSpo2Result: event => {
      if (event.result) {
        setSpO2Result(event.result);
      }
    },
  });

  useEffect(() => {
    if (!isConnected)
      navigation.navigate('DeviceInitialization', {testRoute: 'BloodOxygen'});
  }, [isConnected]);

  useEffect(() => {
    setSpO2Result(undefined);
  }, []);

  async function startMeasurement() {
    await measureBloodOxygen();
    setTimeout(async () => {
      await stopSpo2();
    }, 40 * 1000);
  }

  function toggleModal(status: boolean) {
    setShowModal(status);
  }

  function reTakeTesthandler() {
    setShowModal(false);
    setSpO2Result(undefined);
  }

  const CustomDrawer = useCallback(() => {
    function saveResult() {
      mutate(
        {
          AppointmentTestId: appointmentTestId!,
          VariableName: ['Blood Oxygen', 'Heart Rate'],
          VariableValue: [
            `${spO2Result?.spo2} %`,
            `${spO2Result?.heartRate} bpm`,
          ],
        },
        {
          onError: () => {
            Toast.show({
              type: 'error',
              text1: 'Someting went wrong while saving test!',
              text2: 'Plese try again.',
            });
          },
          onSuccess: () => {
            setSpO2Result(undefined);
            toggleModal(false),
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

    return (
      <Modal
        visible={
          showModal &&
          navigation.getState().routes[navigation.getState().index].name ===
            'BloodOxygen'
        }
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setSpO2Result(undefined);
          toggleModal(false);
        }}>
        <Pressable
          onPress={() => {
            setSpO2Result(undefined);
            toggleModal(false);
          }}
          className="w-full h-full bg-black opacity-25"></Pressable>
        <View
          style={{
            ...meetingStyles.modal,
            height: '50%',
          }}
          className="p-4 pb-8 bg-white m-4 mb-8">
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
                    source={require('../assets/icons/devices/blood_pressure.png')}
                  />
                </View>
                <CustomTextSemiBold className="ml-4 text-lg text-primmary">
                  Blood Oxygen
                </CustomTextSemiBold>
              </View>
              <View className="mt-4">
                <View>
                  <CustomTextSemiBold className="text-text">
                    Blood Oxygen
                  </CustomTextSemiBold>
                  <CustomTextRegular className="text-gray-600">
                    Heart Rate: {spO2Result?.heartRate}: bpm
                  </CustomTextRegular>
                  <CustomTextRegular className="text-gray-600">
                    Blood Oxygen: {spO2Result?.spo2}: %
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

  function handleTestInProgress() {
    Alert.alert(
      'Test in Progress',
      'Blood Oxygen test is in progress. Please wait for it to complete or stop the test and then go back.',
      [
        {
          text: 'Stop Test and Exit',
          onPress: () => {
            stopSpo2();
            setSpO2Result(undefined)
            navigation.goBack();
          },
          style: 'destructive',
        },
        {
          text: 'Cancel',
          isPreferred: true,
          style: 'default',
        },
      ],
    );
  }

  return (
    <CustomSafeArea stylesClass="flex-1 bg-white">
      <View className="flex-1">
        <View className="flex-row items-center py-5 mx-5">
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              isMeasuring ? handleTestInProgress() : navigation.goBack();
            }}
            className="p-1">
            <Image
              source={require('../assets/icons/back_arrow.png')}
              alt="Go back"
            />
          </TouchableOpacity>
          <CustomTextRegular className="mx-auto text-xl text-text">
            Blood Oxygen Saturation
          </CustomTextRegular>
          <DrawerToggleButton tintColor="black" />
        </View>

        <BoGraph ref={bloodOxygenGraphRef} />

        {/* Result here */}
        <View className="p-4 mx-5 mt-4 border border-gray-300 rounded-md">
          {/* <CustomTextRegular className="px-2 py-1 mx-auto mb-4 text-xs border rounded-full text-secondary w-fit border-secondary">
            Normal
          </CustomTextRegular> */}
          <View className="flex-row items-stretch">
            <View className="items-center flex-1 max-w-[100px] mx-auto">
              <CustomTextSemiBold className="mb-4 text-xs text-text">
                Blood Oxygen
              </CustomTextSemiBold>
              <View className="flex-row items-end">
                <CustomTextRegular className="text-base text-text">
                  {spO2Result?.spo2 ?? 0}
                </CustomTextRegular>
                <CustomTextRegular className="text-[10px] text-text">
                  %
                </CustomTextRegular>
              </View>
            </View>
            <View className="items-center flex-1 max-w-[100px] mx-auto">
              <CustomTextSemiBold className="mb-4 text-xs text-text">
                Heart Rate
              </CustomTextSemiBold>
              <View className="flex-row items-end">
                <CustomTextRegular className="text-base text-text">
                  {spO2Result?.heartRate ?? 0}
                </CustomTextRegular>
                <CustomTextRegular className="text-[10px] text-text">
                  bpm
                </CustomTextRegular>
              </View>
            </View>
          </View>
          <Image
            className="flex-1"
            source={require('../assets/images/normal_spo2.png')}
            alt="normal oxygen level"
          />
        </View>

        <View className="flex flex-row justify-between mx-5 mt-10">
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
          <View className="flex flex-row items-center px-3 py-1 rounded-full bg-primmary">
            <BatteryIndicator percentage={battery} />
            <CustomTextSemiBold className="ml-2 text-xs text-white">
              {battery} %
            </CustomTextSemiBold>
          </View>
        </View>
        <Button
          text={isMeasuring ? 'Measuring...' : 'Start Test'}
          className="mx-5 mt-auto mb-5"
          disabled={isMeasuring}
          onPress={() => startMeasurement()}
        />
      </View>
      <CustomDrawer />
    </CustomSafeArea>
  );
}
