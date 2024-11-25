import { StyleSheet, Text, View, Alert, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useState, useLayoutEffect }from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter, useNavigation } from 'expo-router'
import { MaterialIcons } from '@expo/vector-icons'
import CustomButton from '../../constants/CustomButton'

import image from '../../assets/DecoImage.png'


const VendorAuthForm = () => {
    const navigation = useNavigation();
    const router = useRouter();

    useLayoutEffect(() => {
        navigation.setOptions({headerShown: false})
    })   

    const [businessName, setBusinessName] = useState('')
    const [businessEmail, setBusinessEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    // Placeholder functions

    const checkIfEmailExists = (businessEmail) => {
 
        return false; 
    } 


    const handleSubmit = () => {
        if(!businessName ||  !businessEmail || !password || !confirmPassword){
            Alert.alert("Error", "Please fill out all fields.")
            return;
        }

        if(checkIfEmailExists(businessEmail)) {
            Alert.alert("Error", "This email is registered to another account. Try Login or use another email.")
            return;
        }
        if(password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match.")
            return;
        }


        router.push('/authentication/businessRegistrationInfo')

    }

  return (
    <SafeAreaView style={styles.container}>
        <Image source={image} style={styles.topLeftImage}/>
        <Text style={styles.header}>Create Your Business Account</Text>

        <View style={styles.imageUploadContainer}>
            <TouchableOpacity style={styles.imageContainer}><MaterialIcons name='add-a-photo' size={40} color='white'/></TouchableOpacity>
        </View>
        
        <View style={styles.formContainer}>
          <TextInput style={styles.input} placeholder='Business Name' placeholderTextColor='white' value={businessName} onChangeText={setBusinessName}/>
          <TextInput style={styles.input} placeholder='Business Email' placeholderTextColor='white'  value={businessEmail} onChangeText={setBusinessEmail}/>


          
           <TextInput style={styles.input} placeholder='Password' placeholderTextColor='white' value={password} onChangeText={setPassword} secureTextEntry/>
           <TextInput style={styles.input} placeholder='Confirm your Password' placeholderTextColor='white'  value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry/> 

           

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

export default VendorAuthForm;