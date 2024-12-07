import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, Alert, ScrollView, Image, StyleSheet, FlatList, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

const Profile = () => {
  const [profileData, setProfileData] = useState({
    userData: null,
    friendsList: [],
    travelPreferences: { food: [], weather: [], activities: [] }
  });

  const [loading, setLoading] = useState(true);
  const [editableField, setEditableField] = useState("");
  const [editedValue, setEditedValue] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editedValues, setEditedValues] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const authHeader = 'Basic ' + btoa('admin:admin'); // Example authorization header

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
              password: '', // Don't prefill password field
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
  
      const updatedData = { [editableField]: editedValue };
  
      const response = await fetch(`http://localhost:8080/api/users/update/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
  
      if (response.ok) {
        const updatedUserData = await response.json();
        setProfileData(prevState => ({
          ...prevState,
          userData: updatedUserData,
        }));
        Alert.alert('Success', 'Profile updated successfully');
        setModalVisible(false);
      } else {
        Alert.alert('Error', 'Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'An error occurred while updating the profile.');
    }
  };

  const toggleSelection = (category, item) => {
    setProfileData(prevState => {
      const newPreferences = { ...prevState.travelPreferences };
      const isSelected = newPreferences[category]?.includes(item);
      newPreferences[category] = isSelected
        ? newPreferences[category].filter(i => i !== item)
        : [...(newPreferences[category] || []), item];
      return { ...prevState, travelPreferences: newPreferences };
    });
  };

  const handleSavePreferences = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const response = await fetch(`http://localhost:8080/api/users/update/preferences/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData.travelPreferences),
      });
      
      if (response.ok) {
        Alert.alert('Success', 'Preferences updated successfully');
        setModalVisible(false);
      } else {
        Alert.alert('Error', 'Failed to update preferences');
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
      Alert.alert('Error', 'An error occurred while updating preferences.');
    }
  };

  const renderBrickPatternSuggestions = (category, items) => {
    const firstRow = items.filter((_, index) => index % 2 === 0);
    const secondRow = items.filter((_, index) => index % 2 !== 0);

    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.brickContainer}>
          <View style={styles.suggestionsRow}>
            {firstRow.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.suggestionItem,
                  profileData.travelPreferences[category]?.includes(item) && styles.selectedItem,
                ]}
                onPress={() => toggleSelection(category, item)}
              >
                <Text style={styles.suggestionText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={[styles.suggestionsRow, styles.offsetRow]}>
            {secondRow.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.suggestionItem,
                  profileData.travelPreferences[category]?.includes(item) && styles.selectedItem,
                ]}
                onPress={() => toggleSelection(category, item)}
              >
                <Text style={styles.suggestionText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    );
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
          <Text style={styles.infoText}>{profileData.userData?.phoneNumber}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.editBtn} onPress={() => handleEditClick('email')}>
        <Text style={styles.editBtnText}>Edit</Text>
      </TouchableOpacity>

      <Text style={styles.header}>Travel Preferences</Text>
      <View style={styles.preferenceSection}>
        <View style={styles.infoRow}>
          <Ionicons name="fast-food" size={20} color="#0B7784" />
          <Text style={styles.subHeader}>Food</Text>
        </View>
        <Text>{profileData.travelPreferences.food.join(', ')}</Text>
      </View>

      <View style={styles.preferenceSection}>
        <View style={styles.infoRow}>
          <Ionicons name="cloud" size={20} color="#0B7784" />
          <Text style={styles.subHeader}>Weather</Text>
        </View>
        <Text>{profileData.travelPreferences.weather.join(', ')}</Text>
      </View>

      <View style={styles.preferenceSection}>
        <View style={styles.infoRow}>
          <Ionicons name="heart" size={20} color="#0B7784" />
          <Text style={styles.subHeader}>Activities</Text>
        </View>
        <Text>{profileData.travelPreferences.activities.join(', ')}</Text>
      </View>

      <TouchableOpacity style={styles.editBtn} onPress={() => handleEditClick('preferences')}>
        <Text style={styles.editBtnText}>Edit Preferences</Text>
      </TouchableOpacity>
      </ScrollView>
      {/* Modal for editing fields */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Edit {editableField}</Text>
          <TextInput
            style={styles.input}
            value={editedValue}
            onChangeText={setEditedValue}
          />
          <Button title="Save Changes" onPress={handleSaveChanges} />
          <Button title="Cancel" onPress={() => setModalVisible(false)} />
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
  modalContainer: { padding: 20, flex: 1, justifyContent: 'center', alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  input: { height: 40, borderColor: 'gray', borderWidth: 1, width: '80%', marginBottom: 20, paddingLeft: 10 },
  suggestionItem: { backgroundColor: 'lightgray', padding: 10, margin: 5, borderRadius: 5 },
  suggestionsRow: { flexDirection: 'row' },
  brickContainer: { flexDirection: 'column' },
  offsetRow: { marginTop: 10 },
  selectedItem: { backgroundColor: '#0B7784' },
  suggestionText: { fontSize: 14, color: '#333' },
});

export default Profile;
