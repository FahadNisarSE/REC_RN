import {
  findNodeHandle,
  PixelRatio,
  requireNativeComponent,
  UIManager,
  useWindowDimensions,
  View,
} from 'react-native';
import {forwardRef, useEffect, useImperativeHandle, useRef} from 'react';

const CameraPreviewViewManager = requireNativeComponent(
  'CameraPreviewViewManager',
);

const createCameraPreviewFragment = (viewId: number) => {
  try {
    UIManager.dispatchViewManagerCommand(
      viewId,
      // we are calling the 'create' command
      UIManager.CameraPreviewViewManager.Commands.create.toString(),
      [viewId],
    );
  } catch (e) {}
};

const updateWaveData = (viewId: number, updateData: number) =>
  UIManager.dispatchViewManagerCommand(
    viewId,
    // we are calling the 'create' command
    UIManager.CameraPreviewViewManager.Commands.updateWaveData.toString(),
    [viewId, updateData],
  );

const CameraPreview = forwardRef((props, ref) => {
  const boGraphRef = useRef(null);

  useEffect(() => {
    const viewId = findNodeHandle(boGraphRef.current);
    if (viewId) createCameraPreviewFragment(viewId);
  }, []);

  function updateData(updatedData: number) {
    const viewId = findNodeHandle(boGraphRef.current);
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
        ref={boGraphRef}
      />
    </View>
  );
});

export default CameraPreview;
