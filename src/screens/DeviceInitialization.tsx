import {View, Text} from 'react-native';
import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {HomeStackNavigatorParamList} from '../utils/AppNavigation';
import StethoScopeInitialization from '../components/StethoScopeInitialization';

type Props = NativeStackScreenProps<
  HomeStackNavigatorParamList,
  'DeviceInitialization'
>;

export default function DeviceInitialization({route, navigation}: Props) {
  return <StethoScopeInitialization />;
}
