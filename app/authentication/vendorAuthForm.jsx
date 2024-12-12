import {StyleSheet, Text, View, Alert, TextInput, TouchableOpacity, Image, ScrollView,} from "react-native";
import React, { useState, useLayoutEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useNavigation } from "expo-router";
import CustomButton from "../../constants/CustomButton";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
const BACKEND_URL = "http://localhost:8080";
const authHeader = 'Basic ' + btoa('admin:admin');
const VendorAuthForm = () => {
    const navigation = useNavigation();
    const router = useRouter();

    useLayoutEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, []);
    // States for all sections
    const [businessName, setBusinessName] = useState("");
    const [businessType, setBusinessType] = useState("");
    const [industry, setIndustry] = useState("");
    const [businessAddress, setBusinessAddress] = useState("");
    const [countryOfOrigin, setCountryOfOrigin] = useState("");
    const [registrationNumber, setRegistrationNumber] = useState("");
    const [businessPhoneNumber, setBusinessPhoneNumber] = useState(""); // Separate business phone
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [representativeEmail, setRepresentativeEmail] = useState("");
    const checkIfUsernameExists = async (username) => {
        try {
            const response = await axios.get(`${BACKEND_URL}/api/users/username/${username}`);
            return response.data.exists;
        } catch (error) {
            console.error("Error checking username", error);
            return false;
        }
    };
    const checkIfEmailExists = async (email) => {
        try {
            const response = await axios.get(`${BACKEND_URL}/api/users/email/${email}`);
            return response.data.exists;
        } catch (error) {
            console.error("Error checking email", error);
            return false;
        }
    };
    const checkIfPhoneNumberExists = async (phoneNumber) => {
        try {
            const response = await axios.get(`${BACKEND_URL}/api/users/phoneNumber/${phoneNumber}`);
            return response.data.exists;
        } catch (error) {
            console.error("Error checking phone number", error);
            return false;
        }
    };
    const checkIfBusinessNameExists = async (businessName) => {
        try {
            const response = await axios.get(`${BACKEND_URL}/api/vendors/filter/name/${businessName}`);
            return response.data.exists;
        } catch (error) {
            console.error("Error checking business name", error);
            return false;
        }
    };
    // Form submission handler
    const handleSubmit = async () => {
        try {
            if (
                !businessName ||
                !businessType ||
                !industry ||
                !businessAddress ||
                !countryOfOrigin ||
                !registrationNumber ||
                !businessPhoneNumber ||
                !phoneNumber ||
                !password ||
                !confirmPassword ||
                !firstName ||
                !lastName ||
                !username ||
                !representativeEmail
            ) {
                Alert.alert("Error", "Please fill out all fields.");
                return;
            }
            if (password !== confirmPassword) {
                Alert.alert("Error", "Passwords do not match.");
                return;
            }
            const combinedVendorData = {
                firstName,
                lastName,
                username,
                email: representativeEmail,
                password,
                phoneNumber,
                role: "vendor",
                businessName,
                businessRegistrationNumber: registrationNumber,
                countryOfRegistration: countryOfOrigin,
                businessAddress,
                businessPhoneNumber,
                businessType,
                industry,
                representativeRole: "Owner",
            };
            const response = await axios.post(`${BACKEND_URL}/api/users/create-user`, combinedVendorData, {
                headers: { 'Content-Type': 'application/json', Authorization: authHeader },
            });
            console.log("Vendor created successfully:", response.data);
            await AsyncStorage.setItem('vendorId', response.data.vendorId);
            router.push('/(auth)/sign-in');
        } catch (error) {
            console.error("Error during registration:", error.response?.data || error.message);
            Alert.alert("Error", "An error occurred during registration.");
        }
    };
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.header}>Register Vendor Account</Text>
                <Text style={styles.header}>If successful, you will be routed back to the Home Screen</Text>
                {/* Account Details Section */}
                <TextInput
                    style={styles.input}
                    placeholder="First Name"
                    value={firstName}
                    onChangeText={setFirstName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Last Name"
                    value={lastName}
                    onChangeText={setLastName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Representative Email"
                    value={representativeEmail}
                    onChangeText={setRepresentativeEmail}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                />
                <TextInput
                    style={styles.input}
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                />

                {/* Business Information Section */}
                <TextInput
                    style={styles.input}
                    placeholder="Business Name"
                    value={businessName}
                    onChangeText={setBusinessName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Business Type"
                    value={businessType}
                    onChangeText={setBusinessType}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Industry"
                    value={industry}
                    onChangeText={setIndustry}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Business Address"
                    value={businessAddress}
                    onChangeText={setBusinessAddress}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Country of Registration"
                    value={countryOfOrigin}
                    onChangeText={setCountryOfOrigin}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Registration Number"
                    value={registrationNumber}
                    onChangeText={setRegistrationNumber}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Business Phone Number"
                    value={businessPhoneNumber}
                    onChangeText={setBusinessPhoneNumber}
                />
                {/* Submit Button */}
                <CustomButton title="Submit" onPress={handleSubmit} />
            </ScrollView>
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#ffffff",
    },
    scrollContainer: {
        alignItems: "center",
        paddingBottom: 30, // Added padding to avoid content being cut off
    },
    topLeftImage: {
        position: "absolute",
        top: -10,
        left: -10,
        width: "100%", // Make responsive
        height: 200, // Adjust to fit the screen better
        resizeMode: "contain", // Maintain aspect ratio
    },
    header: {
        fontSize: 24, // Large and clear header text
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
        color: "#073B4C", // Slightly darker shade for readability
    },
    sectionHeader: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#118AB2",
        alignSelf: "flex-start",
    },
    input: {
        width: "100%",
        height: 50,
        borderColor: "#ddd",
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 15,
        paddingLeft: 10,
        fontSize: 16,
        color: "#2E3B4E", // Text color matches the background contrast
        backgroundColor: "#F5F5F5", // Light background for inputs
    },
    inputRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginBottom: 15,
    },
    halfWidthInput: {
        width: "48%", // Make both fields occupy equal space within the row
    },
    button: {
        backgroundColor: "#0B7784",
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 8,
        marginTop: 20,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "white",
        textAlign: "center",
    },
    errorText: {
        fontSize: 14,
        color: "red",
        marginBottom: 10,
        textAlign: "left",
        alignSelf: "flex-start",
    },
});
export default VendorAuthForm;
