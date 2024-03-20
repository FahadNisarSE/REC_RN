import {View, Text} from 'react-native';
import React from 'react';
import CustomTextSemiBold from '../components/ui/CustomTextSemiBold';
import CustomTextRegular from '../components/ui/CustomTextRegular';

export default function AboutUs() {
  return (
    <>
      <View className="items-center justify-center flex-1">
        <CustomTextSemiBold className="text-center text-text">
          AboutUs
        </CustomTextSemiBold>
        <CustomTextRegular className="mt-4 text-center text-text">
          Screen under developmnent!
        </CustomTextRegular>
      </View>
    </>
  );
}
