// import React from 'react';
// import {TouchableOpacity} from 'react-native';
// import CustomTextSemiBold from './CustomTextSemiBold';

// export default function Button(props: {
//   text: string;
//   className?: string;
//   onPress: any;
// }) {
//   return (
//     <TouchableOpacity
//       activeOpacity={0.9}
//       onPress={props.onPress}
//       className={`bg-green rounded-md px-5 py-2.5 me-2 mb-2 ${props.className}`}>
//       <CustomTextSemiBold className="text-base font-semibold text-center text-white">
//         {props.text}
//       </CustomTextSemiBold>
//     </TouchableOpacity>
//   );
// }

import React from 'react';
import {TouchableOpacity, TouchableOpacityProps, ViewStyle} from 'react-native';
import CustomTextSemiBold from './CustomTextSemiBold';
import LinearGradient from 'react-native-linear-gradient';

interface ButtonProps extends TouchableOpacityProps {
  text: string;
  style?: ViewStyle;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({text, style, onPress, ...rest}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      className={rest.className}
      style={[
        {
          backgroundColor: 'rgb(0 166 66)',
          borderRadius: 8,
          padding: 10,
        },
        style,
      ]}
      {...rest}>
      <CustomTextSemiBold
        style={{
          fontSize: 16,
          fontWeight: '600',
          textAlign: 'center',
          color: 'white',
        }}>
        {text}
      </CustomTextSemiBold>
    </TouchableOpacity>
  );
};

export default Button;
