import {Text, TouchableOpacity, useWindowDimensions, View} from 'react-native';
import BoGraph from '../nativemodules/MinttiVision/BoGraph.tsx';
import {useRef} from 'react';
import Button from '../components/ui/Button.tsx';
import useMinttiVision from '../nativemodules/MinttiVision/useMinttiVision.ts';

const VisionTestScreen = () => {
  const boGraphRef = useRef();
  const {
    discoverDevices,
    connectToDevice,
    discoveredDevices,
    connectedDevice,
    measureBloodOxygenSaturation,
  } = useMinttiVision({
    onScanResult: event => {
      console.log('onScanResult>>', event);
    },
    onSpo2: event => {
      console.log(event);
      boGraphRef?.current?.updateData(event.waveData);
    },
  });

  return (
    <View
      style={{
        height: useWindowDimensions().height,
        backgroundColor: 'pink',
      }}>
      <BoGraph ref={boGraphRef} />
      <Button
        text={'Add'}
        onPress={() => {
          discoverDevices();
          boGraphRef?.current?.updateData(12);
        }}
      />
      <Button
        text={'Measure BO'}
        onPress={() => {
          measureBloodOxygenSaturation();
        }}
      />
      {discoveredDevices?.map(device => (
        <TouchableOpacity onPress={() => connectToDevice(device)}>
          <Text style={{marginTop: 32}}>{device.name}</Text>
        </TouchableOpacity>
      ))}

      {connectedDevice && <Text>{connectedDevice.mac}</Text>}
    </View>
  );
};

export default VisionTestScreen;
