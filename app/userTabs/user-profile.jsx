import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, Alert, ScrollView, Image, StyleSheet, FlatList, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';
  
  const cleaned = ('' + phoneNumber).replace(/\D/g, ''); // Remove all non-numeric characters
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]} - ${match[3]}`;
  }
  
  return phoneNumber; // Return the original if formatting isn't possible
}

const Profile = () => {
  const [profileData, setProfileData] = useState({
    userData: null,
    friendsList: [],
    travelPreferences: { food: [], weather: [], activities: [] }
  });
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [editableField, setEditableField] = useState("");
  const [editedValue, setEditedValue] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editedValues, setEditedValues] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    firstName: '',
    lastName: '',
    password: '',
  });

  const authHeader = 'Basic ' + btoa('admin:admin'); 
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
          const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
            method: 'GET',
            headers: {
              'Authorization': authHeader,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            setProfileData({
              userData: data,
              friendsList: data.friendIds || [],
              travelPreferences: data.travelPreferences || { food: [], weather: [], activities: [] }
            });

            setEditedValues({
              firstName: data.firstName,
              lastName: data.lastName,
              username: data.username,
              email: data.email,
              phoneNumber: data.phoneNumber,
              password: '', 
            });
          } else {
            Alert.alert('Error', 'Failed to fetch user data');
          }
        } else {
          Alert.alert('Error', 'User ID not found in AsyncStorage');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Failed to fetch user data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleEditClick = (field) => {
    setEditableField(field); 
    setEditedValue(profileData.userData?.[field] || "");  
    setModalVisible(true); 
  };

  const handleSaveChanges = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Error', 'User ID not found in AsyncStorage');
        return;
      }
  
      // Filter out the fields with empty strings in `editedValues`
      const updatedFields = Object.keys(editedValues).reduce((acc, key) => {
        if (editedValues[key] !== "") {
          acc[key] = editedValues[key];
        }
        return acc;
      }, {});
  
      // Merge the updated fields with the current profile data
      const mergedData = {
        ...profileData.userData, // Keep unchanged fields from the profile
        ...updatedFields, // Only update the changed fields
      };
  
      const response = await fetch(`http://localhost:8080/api/users/update/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mergedData),
      });
  
      if (response.ok) {
        const updatedUserData = await response.json();
        setProfileData((prevState) => ({
          ...prevState,
          userData: updatedUserData, // Update with the full, updated user data
        }));
        Alert.alert('Success', 'Profile updated successfully');
        setModalVisible(false);
      } else {
        const errorMessage = await response.text();
        console.error('Error updating profile:', errorMessage);
        Alert.alert('Error', `Failed to update profile: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'An error occurred while updating the profile.');
    }
  };
  
  const handelEditPreference = () => {
    router.push('/components/user/edit-preferences');
  };

  

  const handleOpenModal = () => {
    setEditedValues({
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      phoneNumber: '',
      password: '',
    }); 
    setModalVisible(true);
  };
  

  if (loading) {
    return <Text>Loading user data...</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
     <ScrollView>
      <View style={styles.profileHeader}>
          <Image 
            source={{ uri: profileData.userData?.profileImage || 'https://placekitten.com/200/200' }} 
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>{profileData.userData?.firstName} {profileData.userData?.lastName}</Text>
          <Text style={styles.profileUsername}>@{profileData.userData?.username || 'unknown'}</Text>
        </View>

        <View style={styles.userInfo}>
          <View style={styles.infoRow}>
            <Ionicons name="mail" size={20} color="#0B7784" style={styles.icon} />
            <Text style={styles.infoText}>{profileData.userData?.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="call" size={20} color="#0B7784" style={styles.icon} />
            <Text style={styles.infoText}>{formatPhoneNumber(profileData.userData?.phoneNumber)}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.editBtn} onPress={handleOpenModal}>
          <Text style={styles.editBtnText}>Edit Details</Text>
        </TouchableOpacity>

        <Text style={styles.header}>Travel Preferences</Text>
        <View style={styles.preferenceSection}>
          <View style={styles.infoRow}>
            <Ionicons name="fast-food" size={20} color="#0B7784" />
            <Text style={styles.subHeader}>Food</Text>
          </View>
          <Text>{(profileData.travelPreferences.food || []).join(', ')}</Text>
        </View>

        <View style={styles.preferenceSection}>
          <View style={styles.infoRow}>
            <Ionicons name="cloud" size={20} color="#0B7784" />
            <Text style={styles.subHeader}>Weather</Text>
          </View>
          <Text>{(profileData.travelPreferences.weather || []).join(', ')}</Text>
        </View>

        <View style={styles.preferenceSection}>
          <View style={styles.infoRow}>
            <Ionicons name="heart" size={20} color="#0B7784" />
            <Text style={styles.subHeader}>Activities</Text>
          </View>
          <Text>{(profileData.travelPreferences.activities || []).join(', ')}</Text>
        </View>

          <TouchableOpacity style={styles.editBtn} onPress={handelEditPreference}>
            <Text style={styles.editBtnText}>Edit Preferences</Text>
          </TouchableOpacity>
          {/* Friends Section */}
          <View style={styles.friendsSection}>
            <Text style={styles.subTitle}>Friends</Text>
            <Text style={styles.friendCount}>
              {profileData.friendsList.length} Friends
            </Text>
            <FlatList
              data={profileData.friendsList}
              renderItem={({ item }) => (
                <View style={styles.friendCard}>
                  <Image 
                    source={{ uri: item.profilePic || 'https://placekitten.com/200/200' }} 
                    style={styles.friendProfilePic} 
                  />
                  <Text style={styles.friendName}>{item.name}</Text>
                </View>
              )}
              keyExtractor={(item) => item.id} 
              horizontal
            />

          </View>
          {/* Sign Out Button */}
          <TouchableOpacity style={styles.signOutBtn} onPress={() => Alert.alert('Sign Out')}>
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>

      </ScrollView>
      {/* Modal for editing fields */}
      <Modal visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
      transparent={true}
      animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              
              {/* Modal Input Fields */}
              <View style={styles.textFieldContainer}>
              <View style={styles.textFieldContainer}>
                <TextInput
                  style={styles.input}
                  value={editedValues.firstName}
                  onChangeText={(text) => setEditedValues({ ...editedValues, firstName: text })}
                  placeholder="First Name"
                  placeholderTextColor="#fff"
                />
              </View>
              <View style={styles.textFieldContainer}>
                <TextInput
                  style={styles.input}
                  value={editedValues.lastName}
                  onChangeText={(text) => setEditedValues({ ...editedValues, lastName: text })}
                  placeholder="Last Name"
                  placeholderTextColor="#fff"
                />
              </View>
                <TextInput
                  style={styles.input}
                  value={editedValues.username}
                  onChangeText={(text) => setEditedValues({ ...editedValues, username: text })}
                  placeholder="Username"
                  placeholderTextColor="#fff"
                  autoCapitalize='none'
                />
              </View>
              <View style={styles.textFieldContainer}>
                <TextInput
                  style={styles.input}
                  value={editedValues.email}
                  onChangeText={(text) => setEditedValues({ ...editedValues, email: text })}
                  placeholder="Email"
                  placeholderTextColor="#fff"
                  autoCapitalize='none'
                />
              </View>
              <View style={styles.textFieldContainer}>
                <TextInput
                  style={styles.input}
                  value={editedValues.phoneNumber}
                  onChangeText={(text) => setEditedValues({ ...editedValues, phoneNumber: text })}
                  placeholder="Phone Number"
                  keyboardType="phone-pad"
                  placeholderTextColor="#fff"
                />
              </View>
              <View style={styles.textFieldContainer}>
                  <TextInput
                    style={styles.input}
                    value={editedValues.password}
                    onChangeText={(text) => setEditedValues({ ...editedValues, password: text })}
                    placeholder="Password"
                    secureTextEntry
                    placeholderTextColor="#fff"
                  />
              </View>
              <View style={styles.modalButtons}>
                <TouchableOpacity onPress={handleSaveChanges} style={styles.modalBtn}>
                  <Text style={styles.modalBtnText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalBtn}>
                  <Text style={styles.modalBtnText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  profileHeader: { 
    alignItems: 'center', 
    marginBottom: 20 
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#0B7784',
    marginBottom: 10,
  },
  profileName: { fontSize: 22, fontWeight: 'bold' },
  profileUsername: { fontSize: 16, color: 'gray' },
  userInfo: { marginBottom: 20 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  icon: { marginRight: 10 },
  infoText: { fontSize: 16 },
  editBtn: { backgroundColor: '#0B7784', padding: 10, borderRadius: 5, alignItems: 'center', marginBottom: 20 },
  editBtnText: { color: '#fff' },
  header: { fontSize: 18, fontWeight: 'bold', marginTop: 20 },
  subHeader: { fontSize: 16, marginLeft: 10 },
  preferenceSection: { marginBottom: 15 },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  textFieldContainer: {
    width: '100%',
    marginBottom: 10,
  },
  input: {
    margin: 5,
    padding: 15,
    height: 60,
    textAlign: 'center',
    backgroundColor: 'rgba(11, 119, 132, 0.5)', 
    borderRadius: 20,
    color: '#fff',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalBtn: {
    backgroundColor: '#0B7784',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    margin: 5,
  },
  modalBtnText: {
    color: '#fff',
    textAlign: 'center',
  },
  friendsSection: {
    marginBottom: 20,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  friendCount: {
    fontSize: 16,
    color: '#777',
    marginBottom: 10,
  },
  friendCard: {
    marginRight: 15,
    alignItems: 'center',
  },
  friendProfilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  friendName: {
    marginTop: 5,
    color: '#0B7784',
  },
  signOutBtn: {
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
  signOutText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default Profile;

