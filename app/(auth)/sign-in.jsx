import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Make sure to import AsyncStorage if you are using it
import { useRouter } from 'expo-router'; // Ensure router is imported if used

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Initialize the router

  const handleLogin = async () => {
    // Input Validation
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username/email and password.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://7514-68-234-200-22.ngrok-free.app/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usernameOrEmail: username, password }),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        Alert.alert('Error', errorResponse.message || 'Login failed. Please try again.');
        return;
      }

      const user = await response.json();


      const userData = {
        id: user._id, 
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role, 
        verificationStatus: user.verificationStatus,
      };


      await AsyncStorage.setItem('userData', JSON.stringify(userData)); 

      // Navigate based on the user's role
      if (user.role === 'admin') {
        router.push('/adminTabs'); // Navigate to Admin tabs
      } else {
        router.push('/userTabs'); // Navigate to User tabs
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.logoContainer}>
          <Image source={require('../../assets/logo.png')} style={styles.logo} />
        </View>
        <Text style={styles.welcomeText}>Welcome Back!</Text>

        <View style={styles.textFieldContainer}>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="Username or Email Address"
            placeholderTextColor="#fff"
          />
        </View>

        <View style={styles.textFieldContainer}>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
            placeholderTextColor="#fff"
          />
        </View>

        <View style={styles.forgotPasswordContainer}>
          <TouchableOpacity onPress={() => router.push('/forgot-password')}>
            <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
          <Text style={styles.loginButtonText}>{loading ? 'Logging in...' : 'Login'}</Text>
        </TouchableOpacity>

        <View style={styles.bottomTextContainer}>
          <Text style={styles.bottomText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/sign-up')}>
            <Text style={styles.createAccountText}>Create one!</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    paddingBottom: 5,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 350,
    height: 350,
    resizeMode: 'contain',
  },
  welcomeText: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#0B7784',
    marginBottom: 15,
  },
  textFieldContainer: {
    width: '100%',
    marginBottom: 10,
  },
  input: {
    padding: 15,
    height: 60,
    textAlign: 'center',
    backgroundColor: 'rgba(11, 119, 132, 0.5)', // MainColor with 0.5 opacity
    borderRadius: 20,
    color: '#fff',
  },
  forgotPasswordContainer: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 5,
  },
  forgotPasswordText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F9C2A6',
    marginBottom: 10,
  },
  loginButton: {
    width: '100%',
    height: 60,
    backgroundColor: '#0B7784',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    marginBottom: 15,
  },
  loginButtonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  bottomTextContainer: {
    flexDirection: 'row',
    marginTop: 15,
  },
  bottomText: {
    fontSize: 16,
    color: '#000',
  },
  createAccountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F9C2A6',
  },
});

export default SignIn;
