import React from 'react';
import { Image, StyleSheet, View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router'; 
import { useAuth } from '../hook/auth'; 
import logo from '../assets/logo.png';
import CustomButton from '../constants/CustomButton';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();
  const { authState } = useAuth(); // Access the authentication state

  // Log authState for debugging
  console.log('Auth State:', authState);
  const renderAuthButtons = () => (
    <>
      <CustomButton title="Login" onPress={() => router.push('/sign-in')} />
      <View style={styles.orContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>or</Text>
        <View style={styles.line} />
      </View>
      <CustomButton title="Create An Account" onPress={() => router.push('/sign-up')} />
    </>
  );

  const renderWelcomeMessage = () => (
    <Text style={styles.welcomeText}>Welcome back, {authState.username}!</Text>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.imageContainer}>
          <Image source={logo} style={styles.logo} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.heading}>Let's Start Your Journey!</Text>
        </View>

        <View style={styles.buttonsContainer}>
          {authState?.authenticated ? renderWelcomeMessage() : renderAuthButtons()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    alignItems: 'center',
    justifyContent: "center",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center', 
    alignItems: 'center',
    height: '100%',     
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
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
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
  welcomeText: { // Style for the welcome text
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#0B7784',
    marginTop: 20,
  },
});