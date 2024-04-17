import {PermissionsAndroid, Platform, ToastAndroid} from 'react-native';
import {PERMISSIONS, request} from 'react-native-permissions';

type VoidCallback = (result: boolean) => void;

interface BluetoothPermissions {
  requestPermissions: (cb: VoidCallback) => Promise<void>;
  checkPermissions: () => Promise<boolean>;
}

export default function useBluetoothPermissions(): BluetoothPermissions {
  const requestPermissions = async (cb: VoidCallback): Promise<void> => {
    if (Platform.OS === 'android') {
      const apiLevel = Platform.Version;

      if (apiLevel < 31) {
        try {
          // const granted = await PermissionsAndroid.request(
          //   PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          //   {
          //     title: 'Location Permission',
          //     message: 'This device needs location access to use Bluetooth.',
          //     buttonNeutral: 'Ask me later',
          //     buttonNegative: '',
          //     buttonPositive: 'OK',
          //   },
          // );

          const permission = await request(
            PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
            {
              title: 'Location Permission',
              message: 'This device needs location access to use Bluetooth.',
              buttonNeutral: 'Ask me later',
              buttonNegative: '',
              buttonPositive: 'OK',
            },
          );

          console.log('Permission: ', permission);

          cb(permission === 'granted');

          // cb(granted === PermissionsAndroid.RESULTS.GRANTED);
        } catch (error) {
          console.log('Error: ', JSON.stringify(error));
          ToastAndroid.show('Permission Denied', 1000);
        }
      } else {
        try {
          const bluetoothScanPermission = await request(PERMISSIONS.ANDROID.BLUETOOTH_SCAN, {
            title: 'Bluetooth Scan Permission',
            message: 'This device needs bluetooth scan permission to connect.',
            buttonNeutral: 'Ask me later',
            buttonNegative: '',
            buttonPositive: 'OK',
          });

          const bluetoothConnectPermission = await request(PERMISSIONS.ANDROID.BLUETOOTH_CONNECT, {
            title: 'Bluetooth Connect Permission',
            message: 'This device needs bluetooth connect permission to connect.',
            buttonNeutral: 'Ask me later',
            buttonNegative: '',
            buttonPositive: 'OK',
          });

          const locationPermission = await request(
            PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
            {
              title: 'Location Permission',
              message: 'This device needs location access to use Bluetooth.',
              buttonNeutral: 'Ask me later',
              buttonNegative: '',
              buttonPositive: 'OK',
            },
          );

          console.log('Result of permission: ', {bluetoothScanPermission, bluetoothConnectPermission, locationPermission});

          cb(bluetoothScanPermission === 'granted' && bluetoothConnectPermission === "granted" && locationPermission === 'granted');
        } catch (error) {
          console.log('Error: ', JSON.stringify(error));
          ToastAndroid.show('Permission Denied', 1000);
        }
      }
    } else {
      // Assume permissions granted on platforms other than Android
      cb(true);
    }
  };

  const checkPermissions = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      const apiLevel = Platform.Version;

      if (apiLevel < 31) {
        // Check ACCESS_FINE_LOCATION for Android versions below 31
        return await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
      } else {
        // Check required permissions for Android versions 31 and above
        const bluetoothScanGranted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        );
        const bluetoothConnectGranted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        );
        const locationGranted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );

        return (
          bluetoothScanGranted && bluetoothConnectGranted && locationGranted
        );
      }
    } else {
      // Assume permissions granted on platforms other than Android
      return true;
    }
  };

  return {requestPermissions, checkPermissions};
}
