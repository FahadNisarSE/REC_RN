import {
  findNodeHandle,
  PixelRatio,
  requireNativeComponent,
  Text,
  TouchableOpacity,
  UIManager,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

let CameraPreviewViewManager;

try {
  CameraPreviewViewManager = requireNativeComponent('CameraPreviewViewManager');
} catch (e) {}

const createCameraPreviewFragment = (viewId: number) => {
  try {
    UIManager.dispatchViewManagerCommand(
      viewId,
      // we are calling the 'create' command
      UIManager.CameraPreviewViewManager.Commands.create.toString(),
      [viewId],
    );
  } catch (e) {
    console.log(e);
  }
};

const rotateVideo = (viewId: number) =>
  UIManager.dispatchViewManagerCommand(
    viewId,
    // we are calling the 'create' command
    UIManager.CameraPreviewViewManager.Commands.rotateVideo.toString(),
    [viewId],
  );
const startVideo = (viewId: number) =>
  UIManager.dispatchViewManagerCommand(
    viewId,
    // we are calling the 'create' command
    UIManager.CameraPreviewViewManager.Commands.startVideo.toString(),
    [viewId],
  );
const stopVideo = (viewId: number) =>
  UIManager.dispatchViewManagerCommand(
    viewId,
    // we are calling the 'create' command
    UIManager.CameraPreviewViewManager.Commands.stopVideo.toString(),
    [viewId],
  );

const CameraPreview = forwardRef((props, ref) => {
  const cameraPreviewRef = useRef(null);
  const cameraPreviewCreated = useRef<boolean>(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const viewId = findNodeHandle(cameraPreviewRef.current);
    if (viewId && !cameraPreviewCreated.current) {
      createCameraPreviewFragment(viewId);
      cameraPreviewCreated.current = true;
    }
  }, []);

  function updateData(updatedData: number) {
    const viewId = findNodeHandle(cameraPreviewRef.current);
    if (viewId) updateWaveData(viewId, updatedData);
  }

  useImperativeHandle(ref, () => ({
    updateData,
  }));

  return (
    <View
      style={{
        height: '100%',
        start: 0,
        width: useWindowDimensions().width,
      }}>
      <CameraPreviewViewManager
        style={{
          // converts dpi to px, provide desired height
          height: PixelRatio.getPixelSizeForLayoutSize(
            useWindowDimensions().width,
          ),
          // converts dpi to px, provide desired width
          width: PixelRatio.getPixelSizeForLayoutSize(
            useWindowDimensions().width,
          ),
          marginTop: 240,
        }}
        ref={cameraPreviewRef}
      />
      <View
        style={{
          width: '100%',
          height: '100%',
          zIndex: 999,
          backgroundColor: 'transparent',
          position: 'absolute',
          justifyContent: 'flex-end',
          padding: 32,
        }}>
        <TouchableOpacity
          onPress={() => {
            if (!isPlaying) {
              setIsPlaying(true);
              startVideo(findNodeHandle(cameraPreviewRef.current)!);
            } else {
              stopVideo(findNodeHandle(cameraPreviewRef.current)!);
              setIsPlaying(false);
            }
          }}
          style={{
            width: 68,
            height: 68,
            borderRadius: 100,
            backgroundColor: 'orange',
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{color: 'black'}}>{isPlaying ? 'Stop' : 'Play'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

export default CameraPreview;
