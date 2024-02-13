import {zodResolver} from '@hookform/resolvers/zod';
import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  Image,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';
import Button from '../components/ui/Button';
import CustomTextRegular from '../components/ui/CustomTextRegular';
import CustomTextSemiBold from '../components/ui/CustomTextSemiBold';
import ExternalLink from '../components/ui/ExternalLink';
import {loginUserSchema} from '../nativemodules/loginSchema';
import {useloggedInStore} from '../utils/store/useLoggedIn';
import globalStyles from '../styles/style';

const {height} = Dimensions.get('window');

export default function Login({}) {
  const setLoggedIn = useloggedInStore(state => state.setLoggedIn);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function signInRequest() {
    setLoggedIn(true);
  }

  const {control, handleSubmit, setValue} = useForm({
    resolver: zodResolver(loginUserSchema),
  });

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setIsKeyboardOpen(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setIsKeyboardOpen(false);
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleInputChange = (feild: string, value: string) => {
    setValue(feild, value.trim());
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar backgroundColor="rgb(0 166 66)" />
      <View className="flex justify-end flex-1 bg-slate-800">
        <View style={styles.loginContainer} className="py-10 bg-white">
          <CustomTextSemiBold className="font-semibold text-center text-green text-mh">
            Welcome Back!
          </CustomTextSemiBold>
          <CustomTextRegular className="text-base text-center text-secondary">
            Log in to your account
          </CustomTextRegular>
          <View className="my-auto">
            <Controller
              control={control}
              name="email"
              render={({
                field: {onChange, onBlur, value},
                fieldState: {error},
              }) => (
                <View>
                  <TextInput
                    placeholderTextColor="rgb(31 41 55)"
                    onChangeText={value => {
                      onChange(value);
                      handleInputChange('email', value);
                    }}
                    style={globalStyles.fontRegular}
                    value={value}
                    placeholder="Email"
                    keyboardType="email-address"
                    className={`w-full h-12 px-2 py-4 mt-4 text-gray-800 ${
                      error?.message ? 'border-red-500' : 'border-gray-200'
                    } border rounded-lg`}
                    autoCorrect={false}
                    autoCapitalize="none"
                  />
                  <Text
                    style={{color: 'red', opacity: error?.message ? 100 : 0}}>
                    {error?.message}
                  </Text>
                </View>
              )}
            />
            <Controller
              control={control}
              name="password"
              render={({field: {onChange, value}, fieldState: {error}}) => (
                <View className="relative">
                  {showPassword ? (
                    <TouchableOpacity
                      className="absolute z-30 flex items-center justify-center w-8 h-8 top-4 right-4"
                      onPress={() => setShowPassword(false)}>
                      <Image
                        className="w-4 h-4"
                        source={require('../assets/icons/eye.png')}
                        alt="hide passowrd"
                      />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      className="absolute z-30 flex items-center justify-center w-8 h-8 top-4 right-4"
                      onPress={() => setShowPassword(true)}>
                      <Image
                        className="w-4 h-4"
                        source={require('../assets/icons/eye-off.png')}
                        alt="show password"
                      />
                    </TouchableOpacity>
                  )}
                  <TextInput
                    placeholderTextColor="rgb(31 41 55)"
                    onChangeText={value => {
                      onChange(value);
                      handleInputChange('password', value);
                    }}
                    style={globalStyles.fontRegular}
                    value={value}
                    placeholder="Password"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    className={`w-full h-12 px-2 py-4 mt-2 mb-auto text-secondary border ${
                      error?.message ? 'border-red-500' : 'border-gray-200'
                    } rounded-lg`}
                    autoCorrect={false}
                  />
                  <Text
                    style={{color: 'red', opacity: error?.message ? 100 : 0}}>
                    {error?.message}
                  </Text>
                </View>
              )}
            />
            <Button
              text="Sign in"
              onPress={handleSubmit(signInRequest)}
              className="mt-8 w-fit"
            />
          </View>
          {!isKeyboardOpen ? (
            <View className="mt-auto">
              <CustomTextRegular
                className="w-10/12 mx-auto text-sm text-center text-secondary"
                style={{lineHeight: 25}}>
                By clicking sign in,{' '}
                <ExternalLink
                  buttonText="T & C"
                  url=""
                  className="text-green"
                />{' '}
                and{' '}
                <ExternalLink
                  buttonText="Privacy Policy"
                  url=""
                  className="text-green"
                />{' '}
                of Remote Medical Care.
              </CustomTextRegular>
            </View>
          ) : null}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  loginContainer: {
    height: '80%',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingHorizontal: 20,
  },
});
