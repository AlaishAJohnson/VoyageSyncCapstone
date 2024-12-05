import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hook/auth';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKEND_URL = 'http://localhost:8080';

const VendorProfile = () => {
  const router = useRouter();
  const { logout } = useAuth();

  const [vendorData, setVendorData] = useState(null);
  const [userData, setUserData] = useState(null); // For username and user-related fields
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Editable fields
  const [businessName, setBusinessName] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState(''); // Editable username field
  const [password, setPassword] = useState('');

  const authHeader = 'Basic ' + btoa('admin:admin');

  // Fetch vendor and user profile data
  const fetchVendorProfile = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('userId');
      console.log('Stored userId from AsyncStorage:', storedUserId);

      if (storedUserId) {
        // Fetch vendor data
        const vendorResponse = await axios.get(
            `${BACKEND_URL}/api/vendors/by-user/${storedUserId}`,
            {
              headers: { Authorization: authHeader },
            }
        );
        console.log('Vendor profile data:', vendorResponse.data);
        setVendorData(vendorResponse.data);

        // Fetch user data
        const userResponse = await axios.get(
            `${BACKEND_URL}/api/users/${storedUserId}`,
            {
              headers: { Authorization: authHeader },
            }
        );
        console.log('User Data:', userResponse.data);
        setUserData(userResponse.data);

        // Set initial values for editable fields
        setBusinessName(vendorResponse.data.businessName || '');
        setBusinessAddress(vendorResponse.data.businessAddress || '');
        setPhoneNumber(vendorResponse.data.businessPhoneNumber || '');
        setEmail(userResponse.data.email || '');
        setUsername(userResponse.data.username || '');
      } else {
        throw new Error('User ID not found');
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
      Alert.alert('Error', 'Failed to load profile data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Update vendor profile
  const updateVendorProfile = async () => {
    setSaving(true);
    try {
      const updatedData = {
        vendorId: vendorData.vendorId,
        businessName,
        businessAddress,
        businessPhoneNumber: phoneNumber,
        email,
        username,
      };
      // Only include the password if it has been changed
      if (password) {
        updatedData.password = password;
      }
      console.log('Updating vendor profile with data:', updatedData);

      await axios.put(`${BACKEND_URL}/api/vendors/update`, updatedData, {
        headers: { Authorization: authHeader },
      });

      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error updating vendor profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Handle sign out
  const handleSignOut = () => {
    logout();
    console.log('User signed out');
    router.push('/');
  };

  useEffect(() => {
    fetchVendorProfile();
  }, []);

  if (loading) {
    return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#0B7784" />
        </View>
    );
  }

  return (
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.header}> Profile Information</Text>

          {/* Static Information */}
          <View style={styles.section}>
            <Text style={styles.label}>Vendor ID:</Text>
            <Text style={styles.value}>{vendorData.vendorId}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>Username:</Text>
              {userData ? (
              <Text style={styles.value}>{userData.username}</Text>
            ) : (
              <Text style={styles.value}>Loading...</Text>
            )}
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>Country of Registration:</Text>
            <Text style={styles.value}>{vendorData.countryOfRegistration}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>Business Address:</Text>
            <Text style={styles.value}>{vendorData.businessAddress}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>Industry:</Text>
            <Text style={styles.value}>{vendorData.industry}</Text>
          </View>

          {/* Editable Information */}
          <Text style={styles.editableHeader}> Change Info⭐️:</Text>

          {/* Username */}
          <Text style={styles.label}>Username</Text>
          <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername} // Editable if needed
          />

          <Text style={styles.label}>Business Name</Text>
          <TextInput
              style={styles.input}
              placeholder="Business Name"
              value={businessName}
              onChangeText={setBusinessName}
          />
          <Text style={styles.label}>Business Address</Text>
          <TextInput
              style={styles.input}
              placeholder="Business Address"
              value={businessAddress}
              onChangeText={setBusinessAddress}
          />
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
          />
          <Text style={styles.label}>Email</Text>
          <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
          />
          <Text style={styles.label}>Password</Text>
          <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
          />

          <TouchableOpacity
              style={styles.saveButton}
              onPress={updateVendorProfile}
              disabled={saving}
          >
            <Text style={styles.saveButtonText}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    paddingTop: 40,
    color: '#000',
  },
  editableHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#000',
  },
  section: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#000',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
  },
  saveButton: {
    backgroundColor: '#0B7784',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  signOutButton: {
    backgroundColor: '#ccc',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  signOutText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default VendorProfile;
