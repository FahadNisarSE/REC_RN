import {
  Dimensions,
  Image,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Button from '../components/ui/Button';
import CustomTextRegular from '../components/ui/CustomTextRegular';
import {DrawerToggleButton} from '@react-navigation/drawer';
import CustomTextSemiBold from '../components/ui/CustomTextSemiBold';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {HomeStackNavigatorParamList} from '../utils/AppNavigation';
import SpInAppUpdates, {
  AndroidInstallStatus,
  IAUUpdateKind,
  StartUpdateOptions,
} from 'sp-react-native-in-app-updates';
import {useEffect, useState} from 'react';

const {width, height} = Dimensions.get('window');

type AboutUsProps = NativeStackScreenProps<
  HomeStackNavigatorParamList,
  'AboutUs'
>; // Renamed for clarity

const inAppUpdates = new SpInAppUpdates(true);

export default function AboutUs({navigation}: AboutUsProps) {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<AndroidInstallStatus>(0);
  const [totalSize, setTotalSize] = useState<number>(0);
  const [currentDownloaded, setCurrentDownloaded] = useState<number>(0);

  const checkForUpdates = async () => {
    // Use a clearer function name
    try {
      const result = await inAppUpdates.checkNeedsUpdate();
      if (result.shouldUpdate) {
        setUpdateAvailable(true);
      } else {
        setUpdateAvailable(false);
      }
    } catch (error) {
      console.log('In app update: ', error);
    }
  };

  const handleUpdateApp = async () => {
    // Use a more descriptive function name
    if (updateAvailable) {
      let updateOptions: StartUpdateOptions = {};
      if (Platform.OS === 'android') {
        updateOptions = {
          updateType: IAUUpdateKind.FLEXIBLE,
        };
      }
      await inAppUpdates.startUpdate(updateOptions);
      inAppUpdates.installUpdate();
    }
  };

  useEffect(() => {
    inAppUpdates.addStatusUpdateListener(param => {
      const {status, bytesDownloaded, totalBytesToDownload} = param;
      setUpdateStatus(status);
      setTotalSize(totalBytesToDownload);
      setCurrentDownloaded(bytesDownloaded);
    });

    return inAppUpdates.removeStatusUpdateListener(() => {});
  }, []);

  return (
    <>
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
        <DrawerToggleButton />
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
        <Button
          onPress={handleUpdateApp}
          disabled={!updateAvailable || updateStatus === 3}
          text={
            updateStatus === 3
              ? `${currentDownloaded} / ${totalSize}`
              : updateAvailable
              ? 'Update Available'
              : 'No Updates Available'
          }
          className="px-5"
        />
      </View>
    </>
  );
}
