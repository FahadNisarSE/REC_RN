import {
  findNodeHandle,
  PixelRatio,
  requireNativeComponent,
  UIManager,
  useWindowDimensions,
} from 'react-native';
import {forwardRef, useEffect, useImperativeHandle, useRef} from 'react';

const EcgChartViewManager = requireNativeComponent('EcgChartViewManager');

const createEcgChartFragment = (viewId: number) => {
  try {
    UIManager.dispatchViewManagerCommand(
      viewId,
      // we are calling the 'create' command
      UIManager.EcgChartViewManager.Commands.create.toString(),
      [viewId],
    );
  } catch (e) {}
};
const updateEcgWaveData = (viewId: number, updateData: number) =>
  UIManager.dispatchViewManagerCommand(
    viewId,
    // we are calling the 'create' command
    UIManager.EcgChartViewManager.Commands.updateWaveData.toString(),
    [viewId, updateData],
  );

const EcgChart = forwardRef((props, ref) => {
  const ecgChartRef = useRef(null);

  useEffect(() => {
    const viewId = findNodeHandle(ecgChartRef.current);
    if (viewId) createEcgChartFragment(viewId);
  }, []);

  function updateEcgData(updatedData: number) {
    const viewId = findNodeHandle(ecgChartRef.current);
    if (viewId) updateEcgWaveData(viewId, updatedData);
  }

  useImperativeHandle(ref, () => ({
    updateEcgData,
  }));

  return (
    <EcgChartViewManager
      style={{
        // converts dpi to px, provide desired height
        height: PixelRatio.getPixelSizeForLayoutSize(200),
        // converts dpi to px, provide desired width
        width: PixelRatio.getPixelSizeForLayoutSize(
          useWindowDimensions().width,
        ),
        marginTop: 240,
      }}
      ref={ecgChartRef}
    />
  );
});

export default EcgChart;
