import { StyleSheet, Text, View, Alert, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useState, useLayoutEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter, useNavigation } from 'expo-router'
import { MaterialIcons } from '@expo/vector-icons'
import CustomButton from '../../constants/CustomButton'
import axios from 'axios'
import image from '../../assets/DecoImage.png'

const BACKEND_URL = 'http://localhost:8080';

const BusinessRepresentativeInfo = () => {
    const navigation = useNavigation();
    const router = useRouter();

    useLayoutEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, []);

    // States for form fields
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [imageUri, setImageUri] = useState(null); // For image upload

    const checkIfUsernameExists = async (username) => {
        try {
            const response = await axios.get(`${BACKEND_URL}/api/users/username/${username}`);
            return response.data.exists;
        } catch (error) {
            console.error('Error checking username', error);
            return false;
        }
    };

    const checkIfEmailExists = async (email) => {
        try {
            const response = await axios.get(`${BACKEND_URL}/api/users/email/${email}`);
            return response.data.exists;
        } catch (error) {
            console.error('Error checking email', error);
            return false;
        }
    };

    const checkIfPhoneNumberExists = async (phoneNumber) => {
        try {
            const response = await axios.get(`${BACKEND_URL}/api/users/phoneNumber/${phoneNumber}`);
            return response.data.exists;
        } catch (error) {
            console.error('Error checking phone number', error);
            return false;
        }
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (!firstName || !lastName || !username || !email || !phoneNumber || !password || !confirmPassword) {
            Alert.alert("Error", "Please fill out all fields.");
            return;
        }
        // Check if the email, username, or phone number exists
        if (await checkIfEmailExists(email)) {
            Alert.alert("Error", "This email is registered to another account. Try Login or use another email.");
            return;
        }
        if (await checkIfUsernameExists(username)) {
            Alert.alert("Error", "Username is taken!");
            return;
        }
        if (await checkIfPhoneNumberExists(phoneNumber)) {
            Alert.alert("Error", "This phone number is registered to another account. Try Login or use another phone number.");
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match.");
            return;
        }

        // Create vendor object
        const vendorData = {
            firstName,
            lastName,
            username,
            email,
            phoneNumber,
            password,
        };
        // Send vendor data to the backend for registration
        try {
            const response = await axios.post(`${BACKEND_URL}/api/users/create-user`, vendorData);
            if (response.data.success) {
                router.push('/vendorTabs');
            } else {
                Alert.alert("Error", "Registration failed. Please try again.");
            }
        } catch (error) {
            console.error('Error during registration:', error);
            Alert.alert("Error", "An error occurred during registration.");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Image source={image} style={styles.topLeftImage} />
            <Text style={styles.header}>Create Your Representative</Text>

            <View style={styles.imageUploadContainer}>
                <TouchableOpacity style={styles.imageContainer}>
                    <MaterialIcons name='add-a-photo' size={40} color='white' />
                </TouchableOpacity>
            </View>

            <View style={styles.formContainer}>
                <View style={styles.inputRow}>
                    <TextInput
                        style={[styles.input, styles.halfWidthInput]}
                        placeholder='First Name'
                        placeholderTextColor='white'
                        value={firstName}
                        onChangeText={setFirstName}
                    />
                    <TextInput
                        style={[styles.input, styles.halfWidthInput]}
                        placeholder='Last Name'
                        placeholderTextColor='white'
                        value={lastName}
                        onChangeText={setLastName}
                    />
                </View>

                <TextInput
                    style={styles.input}
                    placeholder='Phone Number'
                    placeholderTextColor='white'
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Username'
                    placeholderTextColor='white'
                    value={username}
                    onChangeText={setUsername}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Email'
                    placeholderTextColor='white'
                    value={email}
                    onChangeText={setEmail}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Password'
                    placeholderTextColor='white'
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <TextInput
                    style={styles.input}
                    placeholder='Confirm your Password'
                    placeholderTextColor='white'
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                />
            </View>
            <CustomButton title='Submit' onPress={handleSubmit} />
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
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
        color: '#0B7784',
    },
    imageUploadContainer: {
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#0B7784',
        justifyContent: 'center',
        alignItems: 'center',
    },
    formContainer: {
        width: '100%',
    },
    inputRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    input: {
        padding: 15,
        height: 60,
        backgroundColor: 'rgba(11, 119, 132, 0.5)',
        borderRadius: 20,
        color: '#fff',
        marginBottom: 20,
        textAlign: 'center',
        fontSize: 20,
    },
    halfWidthInput: {
        width: '48%',
    },
});
export default BusinessRepresentativeInfo;
