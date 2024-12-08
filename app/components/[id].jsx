import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

const BACKEND_URL = 'http://localhost:8080/api/users'; 

const UserProfile = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams(); 
  const [userData, setUserData] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [activationLoading, setActivationLoading] = useState(false); 
  const [verificationStatus, setVerificationStatus] = useState(null);

  const authHeader = 'Basic ' + btoa('admin:admin'); 

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authHeader,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
          setVerificationStatus(data.verificationStatus); 
        } else {
          throw new Error('Failed to fetch user data');
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  // Toggle Activation Status
  const toggleActivation = async () => {
    if (!userData) return;

    setActivationLoading(true);
    const newStatus = !userData.activated;
    try {
      const response = await fetch(`${BACKEND_URL}/${id}/activation?activated=${newStatus}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader,  
        },
      });

      if (!response.ok) {
        throw new Error('Failed to update activation status.');
      }

      const updatedData = await response.json();
      setUserData({ ...userData, activated: newStatus });
      Alert.alert('Success', `User has been ${newStatus ? 'activated' : 'deactivated'}.`);
    } catch (error) {
      console.error('Error updating activation status:', error);
      Alert.alert('Error', 'Failed to update activation status.');
    } finally {
      setActivationLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0B7784" />
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>User data not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: userData.profileImage || 'https://static.vecteezy.com/system/resources/previews/014/194/216/non_2x/avatar-icon-human-a-person-s-badge-social-media-profile-symbol-the-symbol-of-a-person-vector.jpg',
        }}
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
        <TouchableOpacity>
          <Ionicons
            name="checkmark"
            size={24}
            color={verificationStatus === 'VERIFIED' ? 'green' : 'red'}
          />
        </TouchableOpacity>
        <Text style={styles.infoText}>{verificationStatus}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.activateButton,
            { backgroundColor: userData.activated ? '#D9534F' : '#5CB85C' },
          ]}
          onPress={toggleActivation}
          disabled={activationLoading}
        >
          {activationLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.contactText}>
              {userData.activated ? 'Deactivate' : 'Activate'}
            </Text>
          )}
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
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
  activateButton: {
    width: '100%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  contactText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default UserProfile;
