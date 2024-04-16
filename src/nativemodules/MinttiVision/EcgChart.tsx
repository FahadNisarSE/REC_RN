import {
  findNodeHandle,
  PixelRatio,
  requireNativeComponent,
  UIManager,
  useWindowDimensions,
  View,
} from 'react-native';
import {forwardRef, useEffect, useImperativeHandle, useRef} from 'react';

const EcgChartViewManager = requireNativeComponent('EcgChart');

const createEcgChartFragment = (viewId: number) => {
  try {
    UIManager.dispatchViewManagerCommand(
      viewId,
      // we are calling the 'create' command
      UIManager.EcgChart.Commands.create.toString(),
      [viewId],
    );
  } catch (e) {}
};
const updateEcgWaveData = (viewId: number, updateData: number) =>
  UIManager.dispatchViewManagerCommand(
    viewId,
    //   // we are calling the 'create' command
    //   // UIManager.EcgChart.Commands.updateWaveData.toString(),
    UIManager.getViewManagerConfig('EcgChart').Commands.updateWaveData,
    [viewId, updateData],
  );

const EcgChart = forwardRef((props, ref) => {
  const ecgChartRef = useRef(null);

  // useEffect(() => {
  //   const viewId = findNodeHandle(ecgChartRef.current);
  //   console.log(viewId, "VIEW ID");
  //   if (viewId) createEcgChartFragment(viewId);
  // }, []);

  function updateEcgData(updatedData: number) {
    const viewId = findNodeHandle(ecgChartRef.current);
    if (viewId) updateEcgWaveData(viewId, updatedData);
  }

  useImperativeHandle(ref, () => ({
    updateEcgData,
  }));

  return (
    <View
      className="border border-gray-200"
      style={{
        height: 220,
        width: useWindowDimensions().width,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <EcgChartViewManager
        style={{
          // converts dpi to px, provide desired height
          height: 220,
          // converts dpi to px, provide desired width
          width: useWindowDimensions().width,
          // marginTop: 30,
        }}
        ref={ecgChartRef}
      />
    </View>
  );
});

export default EcgChart;
