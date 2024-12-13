import { StyleSheet, Text, View, Alert, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useState, useLayoutEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter, useNavigation } from 'expo-router'
import { MaterialIcons } from '@expo/vector-icons'
import CustomButton from '../../constants/CustomButton'
import AsyncStorage from '@react-native-async-storage/async-storage' 


import image from '../../assets/DecoImage.png'

const AdminAuthForm = () => {
    const navigation = useNavigation();
    const router = useRouter();

    useLayoutEffect(() => {
        navigation.setOptions({ headerShown: false });
    });

    // Authentication Functions & States
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const handleSubmit = async () => {
      if (!firstName || !lastName || !username || !email || !phoneNumber || !password || !confirmPassword) {
          Alert.alert("Error", "Please fill out all fields.");
          return;
      }
  
      if (password !== confirmPassword) {
          Alert.alert("Error", "Passwords do not match.");
          return;
      }
  
      const userData = {
          firstName,
          lastName,
          username,
          role: 'admin',
          email,
          phoneNumber,
          password
      };
  
      // Add this line to log userData
      console.log("Admin data being sent:", userData);
  
      try {
          const response = await fetch('http://localhost:8080/api/users/create-user', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Basic ' + btoa('admin:admin')
              },
              body: JSON.stringify(userData),
          });
  
          if (response.ok) {
              const responseData = await response.json(); 
              console.log("Response Data:", responseData); 
              const userId = responseData.userId; 
              await AsyncStorage.setItem('userId', userId); 
              console.log("Admin ID stored in AsyncStorage:", userId);
              console.log("Admin created, navigating to Admin Tabs...");
              router.push('/adminTabs/analytics');
          } else {
              const errorData = await response.text();
              console.error('Error Response:', errorData);
              Alert.alert("Error", errorData || "Something went wrong");
          }
      } catch (error) {
          Alert.alert("Error", "Error creating user.");
          console.error(error);
      }
  };
  

    return (
        <SafeAreaView style={styles.container}>
            <Image source={image} style={styles.topLeftImage} />
            <Text style={styles.header}>Admin Registration</Text>

            <View style={styles.imageUploadContainer}>
                <TouchableOpacity style={styles.imageContainer}><MaterialIcons name='add-a-photo' size={40} color='white' /></TouchableOpacity>
            </View>

            <View style={styles.formContainer}>
                <View style={styles.inputRow}>
                    <TextInput style={[styles.input, styles.halfWidthInput]} placeholder='First Name' placeholderTextColor='white' value={firstName} onChangeText={setFirstName} />
                    <TextInput style={[styles.input, styles.halfWidthInput]} placeholder='Last Name' placeholderTextColor='white' value={lastName} onChangeText={setLastName} />
                </View>

                <TextInput style={styles.input} placeholder='Phone Number' placeholderTextColor='white' keyboardType="phone-pad" value={phoneNumber} onChangeText={setPhoneNumber} />
                <TextInput style={styles.input} placeholder='Username' placeholderTextColor='white' value={username} onChangeText={setUsername} autoCapitalize="none" />
                <TextInput style={styles.input} placeholder='Email' placeholderTextColor='white' value={email} onChangeText={setEmail} />
                <TextInput style={styles.input} placeholder='Password' placeholderTextColor='white' value={password} onChangeText={setPassword} secureTextEntry />
                <TextInput style={styles.input} placeholder='Confirm your Password' placeholderTextColor='white' value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
            </View>

            <CustomButton title='Register' onPress={handleSubmit} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    topLeftImage: {
        position: 'absolute',
        top: -10,
        left: -10,
        width: 490,
        height: 490,
    },
    header: {
        fontSize: 35,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#0B7784'
    },
    imageUploadContainer: {
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#0B7784',
        justifyContent: 'center',
        alignItems: 'center'
    },
    formContainer: {
        width: '100%'
    },
    inputRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    input: {
        padding: 15,
        height: 60,
        backgroundColor: 'rgba(11, 119, 132, 0.5)', 
        borderRadius: 20,
        color: '#fff',
        marginBottom: 20,
        textAlign: 'center',
        fontSize: 20
    },
    halfWidthInput: {
        width: '48%',
    },
    submitButton: {
        backgroundColor: '#0B7784',
        fontSize: 18,
        fontWeight: 'bold'
    }
});
export default AdminAuthForm;
