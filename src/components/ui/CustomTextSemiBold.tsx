import React, {ReactNode} from 'react';
import {Text as RNText, StyleSheet, TextStyle} from 'react-native';

interface CustomTextProps {
  style?: TextStyle;
  children: ReactNode;
  className?: string;
}

const CustomTextSemiBold: React.FC<CustomTextProps> = props => {
  return (
    <RNText
      style={[styles.text, props.style]}
      className={props.className}>
      {props.children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Inter-SemiBold',
  },
});

export default CustomTextSemiBold;
