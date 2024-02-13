import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import CustomTextSemiBold from './ui/CustomTextSemiBold';
import CustomTextRegular from './ui/CustomTextRegular';
import useBluetoothPermissions from '../utils/hook/useBluetoothPermission';

const dimension = Dimensions.get('window');

function buttonText(permission: boolean, connected: boolean) {
  if (!permission) return 'Request permission';

  if (!connected) return 'Scan for devices';

  return 'Connect to device';
}

export default function StethoScopeInitialization() {
  const navigation = useNavigation();
  const [bluetoothPermissions, setBluetoothPermissions] = useState(false);
  const [isDeviceConnected, setIsDeviceConnected] = useState(false);
  const {requestPermissions, checkPermissions} = useBluetoothPermissions();

  useEffect(() => {
    requestPermissions((result: boolean) => setBluetoothPermissions(result));
  }, []);

  async function onPressHandler() {
    if (!bluetoothPermissions)
      requestPermissions((result: boolean) => setBluetoothPermissions(result));
  }

  return (
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
        <CustomTextRegular className="mx-auto text-xl text-secondary">
          Electronic StethoScope
        </CustomTextRegular>
      </View>
      <Image
        className="mx-auto my-8"
        style={styles.deviceImage}
        source={require('../assets/images/stethoscope.jpg')}
        alt="Electronic Stethoscope"
      />
      <View className="p-4 my-5 mt-auto rounded-xl bg-green">
        <CustomTextSemiBold className="mb-2 text-xl text-center text-white">
          Pair Device
        </CustomTextSemiBold>
        <CustomTextRegular className="text-sm text-center text-gray-50">
          Make sure your device is turned on and located within connection
          range. Make sure to turn on Bluetooth and location beforehand.
        </CustomTextRegular>
        <TouchableOpacity
          onPress={() => onPressHandler()}
          style={styles.pairDeviceBtn}
          className="flex-row items-center p-1.5 mt-4 rounded-full">
          <View
            style={{backgroundColor: 'rgb(26 49 54)'}}
            className="p-2 rounded-full">
            <Image
              className="w-5 h-5"
              source={require('../assets/icons/bluetooth.png')}
              alt="Bluetooth image"
            />
          </View>
          <CustomTextSemiBold className="mx-auto text-xl text-secondary">
            {buttonText(bluetoothPermissions, isDeviceConnected)}
          </CustomTextSemiBold>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  deviceImage: {
    height: dimension.height * 0.3,
    width: dimension.width * 0.9,
    objectFit: 'contain',
  },
  pairDeviceBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
});
