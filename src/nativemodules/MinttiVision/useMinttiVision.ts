import {useEffect, useState} from 'react';
import {NativeEventEmitter, NativeModules, ToastAndroid} from 'react-native';
import {useMinttiVisionStore} from '../../utils/store/useMinttiVisionStore';
import Toast from 'react-native-toast-message';

const {VisionModule} = NativeModules;

const useMinttiVision = ({
  onSpo2,
  onScanResult,
  onEcg,
  onBp,
  onBgEvent,
  onBgResult,
}: useMinttiVisionProps) => {
  const [discoveredDevices, setDiscoveredDevices] = useState<BleDevice[]>();
  const [connectedDevice, setConnectedDevice] = useState<BleDevice>();
  const {
    setBp,
    setSpo2,
    setBgResult,
    setBgEvent,
    setTemperature,
    setBattery,
    setECG,
    setBleDevices,
    setIsConnecting,
    setIsScanning,
    setIsMeasuring,
    setIsConnected,
  } = useMinttiVisionStore();

  useEffect(() => {
    const eventEmitter = new NativeEventEmitter(NativeModules.VisionModule);
    const scanEventListener = eventEmitter.addListener(
      'onScanResult',
      event => {
        console.log('Device found: ', event);
        setDiscoveredDevices([event]);
        setBleDevices(event);
        onScanResult && onScanResult(event);
      },
    );
    const batteryListener = eventEmitter.addListener('onBattery', event =>
      setBattery(event.battery),
    );
    const bodyTemperatureListener = eventEmitter.addListener(
      'onBodyTemperatureResult',
      event => {
        console.log('Body temperature: ', event);
      },
    );

    const bpListener = eventEmitter.addListener('onBp', event => {
      onBp && onBp(event);
    });
    const spo2Listener = eventEmitter.addListener('onSpo2', event => {
      console.log('Spo2: ', event);
      setSpo2(event);
      onSpo2 && onSpo2(event);
    });
    const ecgListener = eventEmitter.addListener('onEcg', event => {
      onEcg && onEcg(event);
    });
    const bgEventListener = eventEmitter.addListener(
      'onBgEvent',
      event => onBgEvent && onBgEvent(event),
    );
    const bgResultListener = eventEmitter.addListener(
      'onBgResult',
      event => onBgResult && onBgResult(event),
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
    };
  }, []);

  const discoverDevices = async () => {
    try {
      setIsScanning(true);
      VisionModule.startDeviceScan('start scanning');
    } catch (e) {
      setIsScanning(false);
      console.log(e);
      ToastAndroid.show('Error' + e, 1000);
    }
  };

  async function connectToDevice(device: BleDevice) {
    try {
      setIsScanning(false);
      setIsConnecting(true);
      await VisionModule.connectToDevice({
        ...device,
      });
      await getBattery();
      setConnectedDevice(device);
      setIsConnecting(false);
      setIsConnected(true);
      Toast.show({
        type: 'success',
        text1: 'Connected to Mintti Vision Device',
      });
    } catch (e) {
      setIsConnected(false);
      setIsConnecting(false);
      Toast.show({
        type: 'error',
        text1: 'Error! Failed while connecting to device',
      });
    }
  }

  async function getBattery() {
    try {
      const battery = await VisionModule.getBattery();
      setBattery(battery);
      return battery;
    } catch (e) {
      console.log('Error getting battery');
    }
  }

  async function measureBodyTemperature() {
    try {
      setIsMeasuring(true);
      const bt = await VisionModule.measureBodyTemperature();
      setIsMeasuring(false);
      setTemperature(bt);
    } catch (e) {}
  }

  async function measureBp() {
    try {
      setIsMeasuring(true);
      await VisionModule.measureBloodPressure();
    } catch (e) {
      setIsMeasuring(false);
    }
  }

  async function measureBloodOxygenSaturation() {
    try {
      setIsMeasuring(true);
      await VisionModule.measureBloodOxygenSaturation();
    } catch (e) {
      setIsMeasuring(false);
    }
  }

  async function measureECG() {
    setIsMeasuring(true);
    await VisionModule.measureECG();
  }

  async function measureBg() {
    try {
      setIsMeasuring(true);
      const res = await VisionModule.measureBloodGlucose();
      console.log('mesareu bg call: ', res);
    } catch (error) {
      console.log('Error in bg: ', error);
    }
  }

  async function stopScan() {
    VisionModule.stopScan();
    setIsScanning(false);
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

export type useMinttiVisionProps = {
  onScanResult?: (event: BleDevice) => void;
  onBattery?: (event: {battery: number}) => void;
  onBodyTemperature?: (event: {bodyTemperature: number} | any) => void;
  onBp?: (event: {
    result:
      | {systolic: number; diastolic: number; heartRate: number}
      | undefined;
    error: string | undefined;
  }) => void;
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
  onBgResult?: (event: {bg: number}) => void;
};

type BgEvent =
  | 'bgEventWaitPagerInsert'
  | 'bgEventPaperUsed'
  | 'bgEventWaitDripBlood'
  | 'bgEventBloodSampleDetecting'
  | 'bgEventGetBgResultTimeout'
  | 'bgEventCalibrationFailed'
  | 'bgEventMeasureEnd';

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

export type TMinittiVisison = typeof useMinttiVision;
