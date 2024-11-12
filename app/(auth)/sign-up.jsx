import { StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import CustomButton from '../../constants/CustomButton';
import logo from '../../assets/logo.png';

const SignUp = () => {
  const router = useRouter();

  const renderAccountTypeButtons = () => (
    <View>
      <CustomButton 
        title="User Account" 
        onPress={() => {
          router.push('/authentication/userAuthForm');
        }} 
      />
      <View style={styles.orContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>or</Text>
        <View style={styles.line} />
      </View>
      <CustomButton 
        title="Vendor Account" 
        onPress={() => {
          router.push('/authentication/vendorAuthForm');
        }} 
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={logo} style={styles.logo} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.heading}>Choose Your Account Type!</Text>
      </View>
      <View style={styles.buttonsContainer}>
        {renderAccountTypeButtons()}
      </View>
    </SafeAreaView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center',
    justifyContent: 'center'
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    justifyContent: 'center'
  },
  line: {
    height: 2,
    width: 100,
    backgroundColor: 'black',
  },
  orText: {
    marginHorizontal: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  imageContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 400,  
    height: 400, 
    resizeMode: 'contain',
  },
  textContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  heading: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 30,
    paddingTop: 10,
    color: '#0B7784',
  },
  buttonsContainer: {
    marginTop: 30,
    alignItems: 'center',
    paddingTop: 20,
  }
});
