import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Pressable,
  TouchableOpacity,
  View,
} from 'react-native';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {FlatList} from 'react-native-gesture-handler';
import CustomTextRegular from '../components/ui/CustomTextRegular';
import CustomTextSemiBold from '../components/ui/CustomTextSemiBold';
import {TTemperatureInstruction} from '../constant/Instructions';
import {HomeStackNavigatorParamList} from '../utils/AppNavigation';
import {useInstuctionsStore} from '../utils/store/useIntructionsStore';
import {DrawerToggleButton} from '@react-navigation/drawer';

const {width, height} = Dimensions.get('window');

type InstrunctionsProps = NativeStackScreenProps<
  HomeStackNavigatorParamList,
  'Intructions'
>;

export default function Instructions({navigation, route}: InstrunctionsProps) {
  const [index, setIndex] = useState(0);
  const scrollx = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList | null>(null);
  const {instructionList} = useInstuctionsStore();

  function handleOnScroll(event: any) {
    Animated.event(
      [
        {
          nativeEvent: {
            contentOffset: {
              x: scrollx,
            },
          },
        },
      ],
      {
        useNativeDriver: false,
      },
    )(event);
  }

  // Todo: Change this function singe viewableItems are undefined in some case
  const handleOnViewItemsChanged = useRef(({viewableItems}: any) => {
    if (viewableItems) setIndex(viewableItems[0]?.index);
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const goToNext = () => {
    if (flatListRef.current) {
      if (index !== instructionList.length - 1)
        flatListRef.current.scrollToIndex({animated: true, index: index + 1});
    }
  };

  const goToPrev = () => {
    if (flatListRef.current) {
      if (index !== 0)
        flatListRef.current.scrollToIndex({animated: true, index: index - 1});
    }
  };

  return (
    <>
      <View className="flex-1 mt-2">
        <View className="flex-row p-4">
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Image
              source={require('../assets/icons/chevron-left.png')}
              alt="Go back"
              className="w-5 h-5"
            />
          </TouchableOpacity>
          <CustomTextSemiBold className="mx-auto mb-2 text-lg text-text">
            {route.params.testType}
          </CustomTextSemiBold>
          <DrawerToggleButton />
        </View>
        <View className="flex-row justify-between px-5">
          <Pressable
            onPress={goToPrev}
            style={{opacity: index === 0 ? 0.5 : 1}}
            className="px-3 py-1 border rounded border-primmary">
            <CustomTextSemiBold className="text-primmary">
              Prev
            </CustomTextSemiBold>
          </Pressable>
          <Pressable
            onPress={goToNext}
            style={{
              opacity: index === instructionList.length - 1 ? 0.5 : 1,
            }}
            className="px-3 py-1 border rounded border-primmary">
            <CustomTextSemiBold className="text-primmary">
              Next
            </CustomTextSemiBold>
          </Pressable>
        </View>
        <FlatList
          ref={flatListRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled={true}
          bounces={false}
          key={instructionList.length}
          data={instructionList}
          onScroll={handleOnScroll}
          keyExtractor={({id}) => id}
          onViewableItemsChanged={handleOnViewItemsChanged}
          viewabilityConfig={viewabilityConfig}
          renderItem={({item}) => <SingleInstrunction {...item} />}
        />
        {/* Pagination */}
        <Pagination length={instructionList.length} scrollX={scrollx} />
      </View>
    </>
  );
}

function SingleInstrunction({
  description,
  image,
  title,
}: TTemperatureInstruction[0]) {
  return (
    <View className="flex items-center justify-center flex-1 w-full">
      <Image
        source={image}
        alt={title}
        style={{
          objectFit: 'scale-down',
          width: width * 0.7,
          height: height * 0.6,
        }}
      />
      <View style={{width}} className="my-8 mt-4">
        <CustomTextSemiBold
          style={{maxWidth: width * 0.8}}
          className="mx-auto text-lg text-center text-primmary">
          {title}
        </CustomTextSemiBold>
        <CustomTextRegular
          style={{maxWidth: width * 0.8}}
          className="mx-auto mt-2 mb-2 text-center text-text">
          {description}
        </CustomTextRegular>
      </View>
    </View>
  );
}

function Pagination({
  length,
  scrollX,
}: {
  length: number;
  scrollX: Animated.Value;
}) {
  return (
    <View className="absolute flex-row items-center justify-center w-full bottom-8">
      {Array.from({length}).map((_, index) => {
        const inputRange = [
          (index - 1) * width,
          index * width,
          (index + 1) * width,
        ];
        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [8, 20, 9],
          extrapolate: 'clamp',
        });

        const backgroundColor = scrollX.interpolate({
          inputRange,
          outputRange: ['#d1d5db', '#374151', '#d1d5db'],
          extrapolate: 'clamp',
        });
        return (
          <Animated.View
            key={index}
            style={{width: dotWidth, backgroundColor}}
            className={`w-2 h-2 mx-1 rounded-full`}
          />
        );
      })}
    </View>
  );
}
