import { Modal, Pressable, View, ScrollView, Image } from "react-native";
import { Clinic } from "../api/schema/loginSchema";
import { meetingStyles } from "../styles/style";
import CustomTextRegular from "./ui/CustomTextRegular";
import CustomTextSemiBold from "./ui/CustomTextSemiBold";

export default function ChangeClinicModal({
    showModal,
    toggleModal,
    clinics,
    clinicId,
    toggleClinicId,
  }: {
    showModal: boolean;
    toggleModal: (showModal: boolean) => void;
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
          className="p-4 pb-8 bg-white m-4 mb-8">
          <View>
            <CustomTextSemiBold className="text-lg text-primmary">
              Change Your Clinic
            </CustomTextSemiBold>
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            className="w-full py-5">
            {clinics?.map(clinic => (
              <Pressable
                className="flex-row items-center justify-between px-2 py-3 mb-2 rounded-lg bg-gray-50 border border-gray-100"
                key={clinic.ClinicId}
                onPress={() => toggleClinicId(clinic.ClinicId)}>
                <CustomTextRegular className="text-text">
                  {clinic.ClinicName}
                </CustomTextRegular>
                <View
                  className={`p-2 rounded bg-primmary ${
                    clinic.ClinicId === clinicId ? 'opacity-100' : 'opacity-0'
                  }`}>
                  <Image
                    source={require('../assets/icons/pin.png')}
                    className="w-4 h-4"
                    alt="selected"
                  />
                </View>
              </Pressable>
            ))}
            <Pressable
              className="flex-row items-center justify-between px-2 py-3 mb-2 rounded-lg bg-gray-50 border border-gray-100"
              onPress={() => toggleClinicId('all')}>
              <CustomTextRegular className="text-text">
                Show All
              </CustomTextRegular>
              <View
                className={`p-2 rounded bg-primmary ${
                  'all' === clinicId ? 'opacity-100' : 'opacity-0'
                }`}>
                <Image
                  source={require('../assets/icons/pin.png')}
                  className="w-4 h-4"
                  alt="selected"
                />
              </View>
            </Pressable>
          </ScrollView>
        </View>
      </Modal>
    );
  }