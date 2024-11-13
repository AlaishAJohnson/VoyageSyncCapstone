import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useNavigation, useLocalSearchParams } from 'expo-router';
//import axios from 'axios'; 
// ^^ to be used in the future for fetching usrprofile data

const UserProfile = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  
  //------------- the state for the verification status------\\
  const [verificationStatus, setVerificationStatus] = useState(userData.verificationStatus); 
  // (2) ^^ the usestate for this will probably be turned to null for future use
  // (3) in order to manage accts being retrieved using ID 
  // (4) and whether or not they are verified
  //----------------------------------------------------------\\
  
  //------------------------------------------------------------\\
  // const [userData, setUserData] = useState(null); 
  // ^^ this will be used in the future when the sample data is removed 
  // and the backend is connected with the front end
  //------------------------------------------------------------\\


  
  // Sample user data
  const userData = {
    firstName: "Test",
    lastName: "Person",
    email: "testPerson@email.com",
    phoneNumber: "(123)456-7890",
    role: "user",
    verificationStatus: "VERIFIED",
  };

  //----- To change the acct status from "VERIFIED"" or "UNVERIFIED"---\\
  const toggleVerificationStatus = () => {
    setVerificationStatus((prevStatus) =>
      prevStatus === "VERIFIED" ? "UNVERIFIED" : "VERIFIED"
    );
  };

  // Hide the tab bar on this screen
  useLayoutEffect(() => {
    navigation.setOptions({ tabBarVisible: false });
  }, [navigation]);

  //---------To be added when sample data is removed---------------------\\
  // we will use this fetch function to get user data based on the acct ID
  // the code is below 
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get(`https://ourapi.com/accounts/${id}`);
  //       setUserData(response.data);
  //       setVerificationStatus(response.data.verificationStatus);
  //     } catch (error) {
  //       console.error('Error getting user data:', error);
  //      setError('It seems that the user data could not be loaded.');
  //     }
  //   };
  //   fetchData();
  // }, [id]);
  //---------------------------handle error message--------------------------------\\
  // this will be used to show loading screen while searching for userData
  // if (!userData) return <Text>Please wait while we find your account...</Text>;
 //--------------------------------------------------------------------------------\\

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: 'https://static.vecteezy.com/system/resources/previews/014/194/216/non_2x/avatar-icon-human-a-person-s-badge-social-media-profile-symbol-the-symbol-of-a-person-vector.jpg' }} // Replace with your user profile image URL
        style={styles.image}
      />
      <Text style={styles.name}>{`${userData.firstName} ${userData.lastName}`}</Text>
      <Text style={styles.role}>{userData.role}</Text>

      <View style={styles.infoContainer}>
        <Ionicons name="mail" size={24} color="#0B7784" />
        <Text style={styles.infoText}>{userData.email}</Text>
      </View>
      
      <View style={styles.infoContainer}>
        <Ionicons name="call" size={24} color="#0B7784" />
        <Text style={styles.infoText}>{userData.phoneNumber}</Text>
      </View>
      
      {/*The verification status toggle button */}
      <View style={styles.infoContainer}>
        <TouchableOpacity onPress={toggleVerificationStatus}>
          <Ionicons
            name="checkmark"
            size={24}
            color={verificationStatus === "VERIFIED" ? "green" : "red"}
          />
        </TouchableOpacity>
        <Text style={styles.infoText}>{verificationStatus}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.contactButton}>
         <Text style={styles.contactText}>Contact</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  role: {
    fontSize: 16,
    marginBottom: 15,
    color: '#666',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  contactButton: {
    width: '100%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginBottom: 15,
    backgroundColor: '#0B7784',
  },
  contactText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  }
});

export default UserProfile;
