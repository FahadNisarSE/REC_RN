import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack/lib/typescript/src/types';
import React, {useState} from 'react';
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  TouchableOpacity,
  View,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import useGetAllAppointments from '../api/query/useGetAllAppointments';
import {Appointment} from '../api/schema/Appointment';
import {Clinic} from '../api/schema/loginSchema';
import {meetingStyles} from '../styles/style';
import {HomeStackNavigatorParamList} from '../utils/AppNavigation';
import {BASE_IMG_URL} from '../utils/config';
import {useSignInStore} from '../utils/store/useSignInStore';
import CustomTextRegular from './ui/CustomTextRegular';
import CustomTextSemiBold from './ui/CustomTextSemiBold';
import Error from './ui/Error';
import Loader from './ui/Loader';
import NoAppointmentFound from './ui/NoAppointmentFound';

export default function AppointmentList() {
  const {userData} = useSignInStore();
  const [showModal, setShowModal] = useState(false);
  const [clinicId, setClinicId] = useState(userData?.Clinics[0].ClinicId);
  const {isLoading, isError, data, refetch} = useGetAllAppointments(clinicId);

  if (isLoading) return <Loader size={50} />;

  if (data?.length === 0) return <NoAppointmentFound callback={refetch} />;

  if (isError) return <Error callback={refetch} />;

  function toggleClinicId(clinicId: string) {
    setClinicId(clinicId);
    setShowModal(false);
    refetch();
  }

  return (
    <View className="flex-1 mt-2">
      <View className="flex-row">
        <TouchableOpacity
          activeOpacity={0.7}
          className="p-2 px-3 my-2 ml-auto text-sm rounded-md w-fit bg-primmary"
          onPress={() => setShowModal(true)}>
          <CustomTextRegular className="text-xs text-white">
            Change Clinic
          </CustomTextRegular>
        </TouchableOpacity>
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={data}
        keyExtractor={item => item.AppointmentId}
        renderItem={({item}) => <AppointmentListCard {...item} />}
      />
      <ChangeClinicModal
        showModal={showModal}
        toggleModal={setShowModal}
        clinics={userData?.Clinics}
        clinicId={clinicId}
        toggleClinicId={toggleClinicId}
      />
    </View>
  );
}

function ChangeClinicModal({
  showModal,
  toggleModal,
  clinics,
  clinicId,
  toggleClinicId,
}: {
  showModal: boolean;
  toggleModal: React.Dispatch<React.SetStateAction<boolean>>;
  clinics: Clinic[] | undefined;
  clinicId: string | undefined;
  toggleClinicId: (clinicId: string) => void;
}) {
  return (
    <Modal
      visible={showModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => toggleModal(false)}>
      <Pressable
        onPress={() => toggleModal(false)}
        className="w-full h-full bg-black opacity-25"></Pressable>
      <View
        style={{
          ...meetingStyles.modal,
          height: '45%',
        }}
        className="p-4 bg-white">
        <View>
          <CustomTextSemiBold className="text-lg text-clr_primmary">
            Change Your Clinic
          </CustomTextSemiBold>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="w-full py-5">
          {clinics?.map(clinic => (
            <Pressable
              className="flex-row items-center justify-between px-2 py-3 rounded shadow-lg bg-gray-50"
              key={clinic.ClinicId}
              onPress={() => toggleClinicId(clinic.ClinicId)}>
              <CustomTextRegular className="text-text">
                {clinic.ClinicName}
              </CustomTextRegular>
              {clinic.ClinicId === clinicId && (
                <View className="p-2 rounded bg-primmary">
                  <Image
                    source={require('../assets/icons/pin.png')}
                    className="w-4 h-4"
                    alt="selected"
                  />
                </View>
              )}
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
}

function AppointmentListCard(item: Appointment) {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackNavigatorParamList>>();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() =>
        navigation.navigate('AppointmentDetail', {id: item.AppointmentId})
      }
      className="relative flex-row items-center px-2 py-3 mt-2 bg-white rounded-lg">
      <Image
        className="w-16 h-full rounded-2xl bg-slate-400"
        source={{uri: BASE_IMG_URL + item.ProfileImg}}
        alt={item.Firstname}
      />
      <CustomTextSemiBold className="absolute px-2 py-1 text-[10px] text-white rounded top-3 right-2 bg-secondary">
        {item.AppointmentDate} | {item.AppointmentStartTime}
      </CustomTextSemiBold>
      <View className="ml-2">
        <View className="">
          <CustomTextSemiBold className="mb-1 text-text">
            {item.Firstname} {item.Lastname}
          </CustomTextSemiBold>
          <CustomTextRegular className="text-xs text-text">
            {item.Symptoms.length > 18
              ? `${item.Symptoms.substring(0, 18)}...`
              : item.Symptoms}
          </CustomTextRegular>
        </View>
        <View className="mt-2">
          <TouchableOpacity
            onPress={() => navigation.navigate('AppointmentDetail', {id: item.AppointmentId})}
            activeOpacity={0.8}
            className="flex items-center justify-center p-2 my-auto text-center bg-transparent rounded bg-primmary">
            <CustomTextSemiBold className="text-xs text-white">
              Recommended Tests
            </CustomTextSemiBold>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}
