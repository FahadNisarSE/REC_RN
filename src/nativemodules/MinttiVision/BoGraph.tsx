import {
  findNodeHandle,
  PixelRatio,
  requireNativeComponent,
  UIManager,
  useWindowDimensions,
  View,
} from 'react-native';
import {forwardRef, useEffect, useImperativeHandle, useRef} from 'react';

const BoGraphViewManager = requireNativeComponent('BoGraph');

const createBoGraphFragment = (viewId: number) => {
  try {
    UIManager.dispatchViewManagerCommand(
      viewId,
      // we are calling the 'create' command
      UIManager.BoGraph.Commands.create.toString(),
      [viewId],
    );
  } catch (e) {}
};

const updateWaveData = (viewId: number, updateData: number) =>
  UIManager.dispatchViewManagerCommand(
    viewId,
    // we are calling the 'create' command
    // UIManager.BoGraph.Commands.updateWaveData.toString(),
    UIManager.getViewManagerConfig('BoGraph').Commands.updateWaveData,
    [viewId, updateData],
  );

const BoGraph = forwardRef((props, ref) => {
  const boGraphRef = useRef(null);

  // useEffect(() => {
  //   const viewId = findNodeHandle(boGraphRef.current);
  //   if (viewId) createBoGraphFragment(viewId);
  // }, []);

  function updateData(updatedData: number) {
    const viewId = findNodeHandle(boGraphRef.current);
    if (viewId) updateWaveData(viewId, updatedData);
  }

  useImperativeHandle(ref, () => ({
    updateData,
  }));

  return (
    <View
      className="border border-gray-200"
      style={{
        height: 220,
        width: useWindowDimensions().width,
        // justifyContent: 'center',
        // alignItems: 'center',
      }}>
      <BoGraphViewManager
        style={{
          height: 220,
          width: useWindowDimensions().width,
        }}
        ref={boGraphRef}
      />
    </View>
  );
});

export default BoGraph;
