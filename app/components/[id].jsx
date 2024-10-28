import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useNavigation, useLocalSearchParams } from 'expo-router';

const UserProfile = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();

  // Sample user data
  const userData = {
    firstName: "Test",
    lastName: "Person",
    email: "testPerson@email.com",
    phoneNumber: "(123)456-7890",
    role: "user",
    verificationStatus: "VERIFIED",
  };

  // Hide the tab bar on this screen
  useLayoutEffect(() => {
    navigation.setOptions({ tabBarVisible: false });
  }, [navigation]);

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

      <View style={styles.infoContainer}>
        <Ionicons name="checkmark" size={24} color={userData.verificationStatus === "VERIFIED" ? "green" : "red"} />
        <Text style={styles.infoText}>{userData.verificationStatus}</Text>
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
