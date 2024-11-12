import { StyleSheet, Text, View, Alert, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useState, useLayoutEffect }from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter, useNavigation } from 'expo-router'
import { MaterialIcons } from '@expo/vector-icons'
import CustomButton from '../../constants/CustomButton'

import image from '../../assets/DecoImage.png'


const BusinessRegistrationInfo = () => {
    const navigation = useNavigation();
    const router = useRouter();

    useLayoutEffect(() => {
        navigation.setOptions({headerShown: false})
    })    // Authentication Functions & States

    const [businessType, setBusinessType] = useState('')
    const [industry, setIndustry] = useState('')
    const [businessAddress, setBusinessAddress] = useState('')
    const [countryOfOrigin, setCountryOfOrigin] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [registrationNumber, setRegistrationNumber] = useState('')

    // Placeholder functions
    const checkIfRegistrationNumberExists = (registrationNumber) => {
        // replace with API call 
        return false; // remove once api call i
    } 

    const checkIfPhoneNumberExists = (phoneNumber) => {
        // replace with API call 
        return false; // remove once api call i
    } 

    const handleSubmit = () => {
        if(!businessType ||  !industry || !businessAddress || !countryOfOrigin || !phoneNumber || !registrationNumber){
            Alert.alert("Error", "Please fill out all fields.")
            return;
        }

        if(checkIfPhoneNumberExists(phoneNumber)) {
            Alert.alert("Error", "This phone number is registered to another account. Try Login or use another phone number.")
            return;
        }
        if(checkIfRegistrationNumberExists(registrationNumber)) {
            Alert.alert("Error", "This registration number is registered to another account.")
        }
        


        router.push('/authentication/businessRepresentativeInfo')
       
    }

  return (
    <SafeAreaView style={styles.container}>
        <Image source={image} style={styles.topLeftImage}/>
        <Text style={styles.header}>Your Business Information</Text>

        <View style={styles.formContainer}>

            <TextInput style={styles.input} placeholder='Business Registration Number' placeholderTextColor='white'  value={registrationNumber} onChangeText={setRegistrationNumber} /> 
            <TextInput style={styles.input} placeholder='Business Type' placeholderTextColor='white' value={businessType} onChangeText={setBusinessType}/>
            <TextInput style={styles.input} placeholder='Industry' placeholderTextColor='white' value={industry} onChangeText={setIndustry}/>
            <TextInput style={styles.input} placeholder='Business Phone Number' placeholderTextColor='white' value={phoneNumber} onChangeText={setPhoneNumber} />
            <TextInput style={styles.input} placeholder='Business Address' placeholderTextColor='white'  value={businessAddress} onChangeText={setBusinessAddress}/>
            <TextInput style={styles.input} placeholder='Country of Origin' placeholderTextColor='white' value={countryOfOrigin} onChangeText={setCountryOfOrigin}/>
        
           

        </View>
        <CustomButton title='Continue' onPress={(handleSubmit)}/>
    </SafeAreaView>
  )
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


})

export default BusinessRegistrationInfo;