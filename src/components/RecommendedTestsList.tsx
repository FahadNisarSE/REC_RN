import {
  Dimensions,
  FlatList,
  Image,
  TouchableOpacity,
  View,
} from 'react-native';
import CustomTextRegular from './ui/CustomTextRegular';
import CustomTextSemiBold from './ui/CustomTextSemiBold';
import {useNavigation} from '@react-navigation/native';
import {HomeStackNavigatorParamList} from '../utils/AppNavigation';

const dimesion = Dimensions.get('window');

const RECOMMENDED_TESTS = [
  {
    id: 0,
    imageUrl: require('../assets/icons/devices/blood_pressure.png'),
    testName: 'Blood Pressure',
    recommendBy: 'Dr. Josh Alexander',
  },
  {
    id: 1,
    imageUrl: require('../assets/icons/devices/oxygen_level.png'),
    testName: 'Oxygen Saturation',
    recommendBy: 'Dr. Josh Alexander',
  },
  {
    id: 2,
    imageUrl: require('../assets/icons/devices/blood_pressure.png'),
    testName: 'Heart Rate',
    recommendBy: 'Dr. Josh Alexander',
  },
  {
    id: 3,
    imageUrl: require('../assets/icons/devices/temperature.png'),
    testName: 'Temprature',
    recommendBy: 'Dr. Josh Alexander',
  },
  {
    id: 4,
    imageUrl: require('../assets/icons/devices/sugar_level.png'),
    testName: 'Blood Glucose',
    recommendBy: 'Dr. Josh Alexander',
  },
  {
    id: 5,
    imageUrl: require('../assets/icons/devices/blood_pressure.png'),
    testName: 'Heart Rate',
    recommendBy: 'Dr. Josh Alexander',
  },
  {
    id: 6,
    imageUrl: require('../assets/icons/devices/lung_wave.png'),
    testName: 'Lung Sound Wave',
    recommendBy: 'Dr. Josh Alexander',
  },
  {
    id: 7,
    imageUrl: require('../assets/icons/devices/lung_wave.png'),
    testName: 'Respiratory Rate',
    recommendBy: 'Dr. Josh Alexander',
  },
];

type Test = typeof RECOMMENDED_TESTS;

function Item({
  imageUrl,
  recommendBy,
  testName,
  onPressFunc,
}: Test[0] & {onPressFunc: () => void}) {
  return (
    <View className="flex-row flex-1 px-2 py-3 mt-2 rounded-lg bg-gray-50">
      <View className="p-2 mr-2 overflow-hidden rounded-full bg-green">
        <Image
          source={imageUrl}
          alt={testName}
          className="w-6 h-6"
          style={{objectFit: 'contain'}}
        />
      </View>
      <View className="flex-1">
        <CustomTextSemiBold className="text-secondary">
          {testName}
        </CustomTextSemiBold>
        <CustomTextRegular className="text-secondary">
          {recommendBy}
        </CustomTextRegular>
      </View>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onPressFunc()}
        className="flex items-center justify-center p-2 my-auto rounded bg-green">
        <CustomTextRegular className="text-xs text-white">
          Start Test
        </CustomTextRegular>
      </TouchableOpacity>
    </View>
  );
}

export default function RecommendedTestsList({
  infoViewHeight,
}: {
  infoViewHeight: number;
}) {
  const navigation = useNavigation<any>();
  return (
    <View>
      <FlatList
        style={{maxHeight: dimesion.height - infoViewHeight - 20}}
        showsVerticalScrollIndicator={false}
        data={RECOMMENDED_TESTS}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <Item
            {...item}
            onPressFunc={() =>
              navigation.navigate('DeviceInitialization', {
                testName: item.testName,
              })
            }
          />
        )}
      />
    </View>
  );
}
