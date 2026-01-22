import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
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
        onPress={() => router.push('/authentication/userAuthForm')} 
      />

      <View style={styles.orContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>or</Text>
        <View style={styles.line} />
      </View>

      <CustomButton 
        title="Vendor Account" 
        onPress={() => router.push('/authentication/vendorAuthForm')} 
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          <Image source={logo} style={styles.logo} />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.heading}>Choose Your Account Type!</Text>
        </View>

        <View style={styles.buttonsContainer}>
          {renderAccountTypeButtons()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },

  scrollContent: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center'
  },

  imageContainer: {
    alignItems: 'center',
    marginBottom: 10
  },

  logo: {
    width: 250,   
    height: 250,
    resizeMode: 'contain',
  },

  textContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },

  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#0B7784',
  },

  buttonsContainer: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },

  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    justifyContent: 'center'
  },

  line: {
    height: 2,
    width: 80,
    backgroundColor: 'black',
  },

  orText: {
    marginHorizontal: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0B7784',
  },
});
