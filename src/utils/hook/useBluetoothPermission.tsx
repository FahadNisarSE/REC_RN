import {
  Alert,
  PermissionStatus,
  PermissionsAndroid,
  Platform,
  ToastAndroid,
} from 'react-native';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import { PERMISSIONS, request } from 'react-native-permissions';

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
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Permission',
              message: 'This device needs location access to use Bluetooth.',
              buttonNeutral: 'Ask me later',
              buttonNegative: '',
              buttonPositive: 'OK',
            },
          );

          cb(granted === PermissionsAndroid.RESULTS.GRANTED);
        } catch (error) {
          console.log('Error: ', JSON.stringify(error));
          ToastAndroid.show('Permission Denied', 1000);
        }
      } else {
        try {
          // Request required permissions for Android versions 31 and above
          const result = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ]);

          console.log('Result of permission: ', result);

          const isGranted =
            result[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] ===
              PermissionsAndroid.RESULTS.GRANTED &&
            result[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] ===
              PermissionsAndroid.RESULTS.GRANTED &&
            result[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] ===
              PermissionsAndroid.RESULTS.GRANTED;

          cb(isGranted);
        } catch (error) {
          console.log('Error: ', JSON.stringify(error));
          ToastAndroid.show('Permission Denied', 1000);
        }
      }
    } else if (Platform.OS === 'ios') {
      try {
        const locationPermission = (await request(
          PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        )) as PermissionStatus;
        const bluetoothPermission = (await request(
          PERMISSIONS.IOS.BLUETOOTH,
        )) as PermissionStatus;

        const permissionAllowed =
          locationPermission === 'granted' && bluetoothPermission === 'granted';
        console.log('Bluetooth permission requested...', {
          locationPermission,
          bluetoothPermission,
        });

        if (!permissionAllowed) {
          const bleState = await BluetoothStateManager.getState();
          switch (bleState) {
            case 'Unknown':
            case 'Resetting':
            case 'Unsupported':
            case 'Unauthorized':
            case 'PoweredOff':
              Alert.alert(
                'Bluetooth is off',
                'Please turn on bluetooth to connect to device.',
              );
              break;
            case 'PoweredOn':
            default:
              break;
          }
        }

        cb(permissionAllowed);
      } catch (error) {
        console.log('Error: ', error);
        cb(false);
      }
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
