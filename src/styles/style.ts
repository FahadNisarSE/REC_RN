import {StyleSheet} from 'react-native';

const globalStyles = StyleSheet.create({
  fontRegular: {
    fontFamily: 'Inter-Regular',
  },
  fontSemiBold: {
    fontFamily: 'Inter-SemiBold',
  },
  fontBold: {
    fontFamily: 'Inter-Bold',
  },
  fontMedium: {
    fontFamily: 'Inter-Medium',
  },
  fontThin: {
    fontFamily: 'Inter-Thin',
  },
  shadow: {
    shadowColor: '#fffff',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 1,
  },
});

export default globalStyles;
