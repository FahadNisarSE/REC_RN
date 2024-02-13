import React, {useState} from 'react';
import {
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import CustomSafeArea from '../components/CustomSafeArea';
import CustomTextSemiBold from '../components/ui/CustomTextSemiBold';
import CustomTextRegular from '../components/ui/CustomTextRegular';
import RecommendedTestsList from '../components/RecommendedTestsList';

const dimension = Dimensions.get('window');
type tabName = 'appointment' | 'devices' | 'instruction';

export default function Home({navigation}: {navigation: any}) {
  const [activeTab, setActiveTab] = useState<tabName>('appointment');
  const [infoViewHeight, setInfoViewHeight] = useState(0);

  return (
    <CustomSafeArea stylesClass="flex-1 mx-5">
      <StatusBar backgroundColor="rgb(0 166 66)" />
      {/* User information  */}
      <View onLayout={e => setInfoViewHeight(e.nativeEvent.layout.height)}>
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
                  Josh Alexander
                </CustomTextSemiBold>
              </View>
              <Image
                className="w-16 h-16 rounded-full"
                source={require('../assets/images/avatar-02.jpg')}
                alt="username"
                style={{objectFit: 'cover'}}
              />
            </View>
            <View className="flex-row items-end justify-between mt-4">
              <View>
                <CustomTextSemiBold className="mt-1 text-sm text-white">
                  Josh@mail.com
                </CustomTextSemiBold>
              </View>
              <View>
                <CustomTextSemiBold className="mt-1 text-sm text-right text-white">
                  Male
                </CustomTextSemiBold>
                <CustomTextSemiBold className="mt-1 text-sm text-right text-white">
                  Jan 12, 2000
                </CustomTextSemiBold>
              </View>
            </View>
          </View>
        </View>

        {/* Menu Bar */}
        <View className="flex-row justify-center gap-1 my-5">
          <TouchableOpacity
            onPress={() => setActiveTab('appointment')}
            activeOpacity={0.7}
            className={`flex-1 py-3 border border-transparent justify-center border-b-green rounded-lg ${
              activeTab === 'appointment'
                ? 'bg-green'
                : 'bg-gray-50'
            }`}>
            <CustomTextSemiBold
              className={`text-center text-xs ${
                activeTab === 'appointment' ? 'text-white' : 'text-secondary'
              }`}>
              Instructions
            </CustomTextSemiBold>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('devices')}
            activeOpacity={0.7}
            className={`flex-1 justify-center border border-transparent py-3 border-b-green rounded-lg ${
              activeTab === 'devices'
                ? 'bg-green'
                : 'bg-gray-50'
            }`}>
            <CustomTextSemiBold
              className={`text-center text-xs ${
                activeTab === 'devices' ? 'text-white' : 'text-secondary'
              }`}>
              Recom. Tests
            </CustomTextSemiBold>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('instruction')}
            activeOpacity={0.7}
            className={`flex-1 py-3 border border-transparent justify-center border-b-green rounded-lg ${
              activeTab === 'instruction'
                ? 'bg-green'
                : 'bg-gray-50'
            }`}>
            <CustomTextSemiBold
              className={`text-center text-xs ${
                activeTab === 'instruction' ? 'text-white' : 'text-secondary'
              }`}>
              Appointments
            </CustomTextSemiBold>
          </TouchableOpacity>
        </View>
      </View>

      {/* Conditionally Rendering components */}
      <CustomRender activeTab={activeTab} infoViewHeight={infoViewHeight} />
    </CustomSafeArea>
  );
}

function CustomRender({
  activeTab,
  infoViewHeight,
}: {
  activeTab: tabName;
  infoViewHeight: number;
}) {
  if (activeTab === 'appointment') return <></>;

  if (activeTab === 'devices')
    return <RecommendedTestsList infoViewHeight={infoViewHeight} />;

  return <></>;
}

const styles = StyleSheet.create({
  homeBody: {
    height: dimension.height * 0.8,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
});
