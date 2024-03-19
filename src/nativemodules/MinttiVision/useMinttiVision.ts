import {NativeEventEmitter, NativeModules, ToastAndroid} from 'react-native';
import {useEffect, useState} from 'react';
import * as events from 'events';

const {VisionModule} = NativeModules;

const useMinttiVision = ({
  onScanResult,
  onBattery,
  onBodyTemperature,
  onBp,
  onSpo2,
  onEcg,
  onBgEvent,
  onBgResult,
  onDisconnected,
}: useMinttiVisionProps) => {
  const [discoveredDevices, setDiscoveredDevices] = useState<BleDevice[]>();
  const [connectedDevice, setConnectedDevice] = useState<BleDevice>();

  useEffect(() => {
    const eventEmitter = new NativeEventEmitter(NativeModules.VisionModule);
    const scanEventListener = eventEmitter.addListener(
      'onScanResult',
      event => {
        setDiscoveredDevices([event]);
        onScanResult && onScanResult(event);
      },
    );
    const batteryListener = eventEmitter.addListener(
      'onBattery',
      onBattery ?? (() => {}),
    );
    const bodyTemperatureListener = eventEmitter.addListener(
      'onBodyTemperatureResult',
      onBodyTemperature ?? (() => {}),
    );

    const bpListener = eventEmitter.addListener('onBp', onBp ?? (() => {}));
    const spo2Listener = eventEmitter.addListener(
      'onSpo2',
      onSpo2 ?? (() => {}),
    );
    const ecgListener = eventEmitter.addListener('onEcg', onEcg ?? (() => {}));
    const bgEventListener = eventEmitter.addListener(
      'onBgEvent',
      onBgEvent ?? (() => {}),
    );
    const bgResultListener = eventEmitter.addListener(
      'onBgResult',
      onBgResult ?? (() => {}),
    );
    const disconnectedListener = eventEmitter.addListener(
      'onDisconnected',
      onDisconnected ?? (() => {}),
    );

    return () => {
      scanEventListener.remove();
      batteryListener.remove();
      bodyTemperatureListener.remove();
      bpListener.remove();
      spo2Listener.remove();
      ecgListener.remove();
      bgEventListener.remove();
      bgResultListener.remove();
      disconnectedListener.remove();
    };
  }, []);

  const discoverDevices = async () => {
    try {
      await VisionModule.startDeviceScan('start scanning');
    } catch (e) {
      console.log(e);
      ToastAndroid.show('Error' + e, 1000);
    }
  };

  async function connectToDevice(device: BleDevice) {
    console.log('Connect to device called');
    try {
      const result = await VisionModule.connectToDevice({
        ...device,
      });
      // await getBattery();
      setConnectedDevice(device);
      ToastAndroid.show('Connected to device \n' + result, 1000);

      console.log('connectToDevice>> success >>', result);
    } catch (e) {
      ToastAndroid.show('Error connecting to device \n' + e, 1000);
      console.log(
        'connectToDevice>> error >>',
        e,
        'Error connecting to device',
      );
    }
  }

  async function getBattery() {
    try {
      const battery = await VisionModule.getBattery();
      console.log('battery>>', battery);
      return battery;
    } catch (e) {
      console.log('Error getting battery');
    }
  }

  async function measureBodyTemperature() {
    try {
      const bt = await VisionModule.measureBodyTemperature();
      console.log('measureBodyTemperature>>', bt);
      return bt;
    } catch (e) {}
  }

  async function measureBp() {
    try {
      VisionModule.measureBloodPressure();
    } catch (e) {}
  }

  async function measureBloodOxygenSaturation() {
    try {
      VisionModule.measureBloodOxygenSaturation();
    } catch (e) {}
  }

  async function measureECG() {
    VisionModule.measureECG();
  }

  async function measureBg() {
    VisionModule.measureBloodGlucose();
  }
  async function stopScan() {
    VisionModule.stopScan();
  }

  return {
    discoverDevices,
    measureBg,
    measureECG,
    measureBloodOxygenSaturation,
    measureBp,
    measureBodyTemperature,
    getBattery,
    connectToDevice,
    stopScan,
    discoveredDevices,
    connectedDevice,
  };
};

type useMinttiVisionProps = {
  onDisconnected?: (event: {message: string}) => void;
  onScanResult?: (event: BleDevice) => void;
  onBattery?: (event: {battery: number}) => void;
  onBodyTemperature?: (event: {bodyTemperature: number} | any) => void;
  onBp?: (
    event:
      | {
          result:
            | {systolic: number; diastolic: number; heartRate: number}
            | undefined;
          error: string | undefined;
        }
      | any,
  ) => void;
  onSpo2?: (event: {
    waveData: number | undefined;
    result: {heartRate: number; spo2: number} | undefined;
    measurementEnded: boolean | undefined;
    message: string | undefined;
  }) => void;
  onEcg?: (event: {
    wave: number | undefined;
    heartRate: number | undefined;
    respiratoryRate: number | undefined;
    results: {rrMax: number; rrMin: number; hrv: number} | undefined;
    duration: {duration: number; isEnd: boolean} | undefined;
  }) => void;
  onBgEvent?: (event: {
    event: BgEvent | undefined;
    message: string | undefined;
  }) => void;
  onBgResult?: (event: {bp: number}) => void;
};

type BgEvent =
  | 'bgEventWaitPagerInsert'
  | 'bgEventPaperUsed'
  | 'bgEventMeasureEnd'
  | 'bgEventGetBgResultTimeout'
  | 'bgEventBloodSampleDetecting'
  | 'bgEventWaitDripBlood'
  | 'bgEventCalibrationFailed';

type BleDevice = {
  rssi: number;
  name: string;
  mac: string;
  bluetoothDevice: {
    type: string;
    address: string;
    bondState: string;
    name: string;
  };
};

export default useMinttiVision;
