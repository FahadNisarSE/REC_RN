import {View, Text, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {meetingStyles} from '../styles/style';
import CustomTextSemiBold from './ui/CustomTextSemiBold';
import CustomTextRegular from './ui/CustomTextRegular';

interface MeetingOtherOptionsProps {
  setShowModal: (value: boolean) => void;
  setActiveVideo: (value: number | null) => void;
  screenSharing: boolean;
  activeVideo: number | null;
  stopScreenSharing: () => void;
  startScreenCapture: () => void;
}

export default function MeetingOtherOptions({
  setShowModal,
  setActiveVideo,
  activeVideo,
  screenSharing,
  stopScreenSharing,
  startScreenCapture,
}: MeetingOtherOptionsProps) {
  const OTHEROPTIONS = [
    {
      title: 'Dental Camera',
      imageUrl: () => require('../assets/icons/dental_camera.png'),
      onPress: () => console.log('Dermatology Lens Pressed..'),
    },
    {
      title: 'Vital Sign Monitor',
      imageUrl: () => require('../assets/icons/vital_sign.png'),
      onPress: () => console.log('Dermatology Lens Pressed..'),
    },
    {
      title: 'Dermatology Lens',
      imageUrl: () => require('../assets/icons/focus.png'),
      onPress: () => console.log('Dermatology Lens Pressed..'),
    },
    {
      title: 'Stethoscope',
      imageUrl: () => require('../assets/icons/stethoscope_dark.png'),
      onPress: () => console.log('Electronic StethoScope Pressed..'),
    },
    {
      title: 'Screen Share',
      imageUrl: () => require('../assets/icons/cast.png'),
      onPress: () => {
        screenSharing ? stopScreenSharing() : startScreenCapture();
        setShowModal(false);
      },
      activeVideo: screenSharing,
    },
    {
      title: 'Exit full Screen',
      imageUrl: () => require('../assets/icons/minimize.png'),
      onPress: () => {
        setActiveVideo(null);
        setShowModal(false);
      },
      active: activeVideo,
    },
  ];

  return (
    <>
      <View className="flex-row items-center justify-between w-full mb-auto">
        <CustomTextSemiBold className="mx-auto text-lg font-semibold text-primary">
          More Options
        </CustomTextSemiBold>
      </View>
      <View className="flex flex-row flex-wrap items-stretch justify-center mb-auto">
        {OTHEROPTIONS.map(option => (
          <TouchableOpacity
            style={meetingStyles.menuButton}
            key={option.title}
            onPress={option.onPress}
            activeOpacity={0.7}
            className={`flex items-center justify-center p-2 mx-1 mb-2 rounded-md ${
              option?.active ? 'bg-white' : 'bg-transparent'
            }`}>
            <Image
              className="w-6 h-6"
              source={option.imageUrl()}
              alt={option.title}
            />
            <CustomTextRegular className="mt-4 text-[10px] text-center text-text">
              {option.title}
            </CustomTextRegular>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
}
