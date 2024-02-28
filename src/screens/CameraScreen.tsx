import {
  NativeModules,
  Text,
  View,
  NativeEventEmitter,
  Button,
} from 'react-native';
import {useEffect} from 'react';
const {CameraModule} = NativeModules;

const CameraScreen = () => {
  useEffect(() => {
    const eventEmitter = new NativeEventEmitter(CameraModule);
    const scanEventListener = eventEmitter.addListener('onResult', event => {
      console.log('onResult', event);
    });

    return () => {};
  }, []);

  function handleStart() {
    CameraModule.startCamera();
  }

  return (
    <View>
      <Text>Camera</Text>
      <Button title={'Start'} onPress={handleStart} />
    </View>
  );
};

export default CameraScreen;
