import {View, Text, StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface ResultIndicatorBarProps {
  value: number;
  lowestLimit: number;
  highestLimit: number;
  lowThreshold: number;
  highThreshold: number;
}

export default function ResultIdicatorBar({
  value,
  lowestLimit,
  highThreshold,
  lowThreshold,
  highestLimit,
}: ResultIndicatorBarProps) {
  const width = useSharedValue(0);

  useEffect(() => {
    let percentage;
    if (value === 0) percentage = 0;
    else
      percentage = ((value - lowestLimit) / (highestLimit - lowestLimit)) * 100;
    width.value = withTiming(percentage, {duration: 1000});
    console.log('Percentage: ', percentage);
  }, [value]);

  let color = 'red';
  if (value >= lowThreshold && value <= highThreshold) {
    color = '#15F5BA';
  } else if (value >= lowestLimit && value <= highestLimit) {
    color = 'yellow';
  }

  const barStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
    backgroundColor: color,
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.bar, barStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 8,
    borderRadius: 10,
    backgroundColor: '#ccc',
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 10,
  },
});
