import {Dimensions, Image, TouchableOpacity, View} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Button from '../components/ui/Button';
import CustomTextRegular from '../components/ui/CustomTextRegular';
import {DrawerToggleButton} from '@react-navigation/drawer';
import CustomTextSemiBold from '../components/ui/CustomTextSemiBold';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {HomeStackNavigatorParamList} from '../utils/AppNavigation';
import CustomSafeArea from '../components/CustomSafeArea';

const {width, height} = Dimensions.get('window');

type AppointmentDetailProps = NativeStackScreenProps<
  HomeStackNavigatorParamList,
  'AppointmentDetail'
>;

export default function AboutUs({navigation}: AppointmentDetailProps) {
  return (
    <CustomSafeArea stylesClass='flex-1'>
      <View className="flex-row items-center p-4">
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Image
            source={require('../assets/icons/chevron-left.png')}
            alt="Go back"
            className="w-5 h-5"
          />
        </TouchableOpacity>
        <CustomTextSemiBold className="mx-auto text-xl text-text">
          About Us
        </CustomTextSemiBold>
        <DrawerToggleButton tintColor='black' />
      </View>
      <View className="items-center justify-center flex-1">
        <Image
          source={require('../assets/images/icon.png')}
          alt="Remote Examination Care"
          style={{
            width: width * 0.7,
            height: width * 0.1,
            objectFit: 'contain',
          }}
        />
        <CustomTextRegular className="my-6 text-center text-text">
          Current Version: {DeviceInfo.getVersion()}
        </CustomTextRegular>
        <Button text="Check for Updates" className="" />
      </View>
    </CustomSafeArea>
  );
}
