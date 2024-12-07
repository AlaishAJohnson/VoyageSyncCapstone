import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, Alert, ScrollView, Image, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

const Profile = () => {
  const [userData, setUserData] = useState(null);  // Store fetched user data
  const [loading, setLoading] = useState(true);
  const [editableField, setEditableField] = useState("");
  const [editedValue, setEditedValue] = useState("");
  const [friendsList, setFriendsList] = useState([]);
  const [travelPreferences, setTravelPreferences] = useState(null);
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
            setUserData(data);  // Set the fetched user data
            setEditableField('email'); 
            setEditedValue(data.email);
            setTravelPreferences(data.travelPreferences);
            setFriendsList(data.friendIds);
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
  }, []);  // Empty dependency array to run only once on mount

  const handleEditClick = (field) => {
    setEditableField(field);
    setEditedValue(userData?.[field] || ""); 
    setModalVisible(true);
  };

  const handleSaveChanges = () => {
    console.log(`Updated ${editableField}: ${editedValue}`);
    setModalVisible(false);
  };

  if (loading) {
    return <Text>Loading user data...</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Image 
          source={{ uri: userData?.profileImage || 'https://placekitten.com/200/200' }} 
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>{userData?.firstName} {userData?.lastName}</Text>
        <Text style={styles.profileUsername}>@{userData?.username || 'unknown'}</Text>
      </View>

      {/* User Info */}
      <View style={styles.userInfo}>
        <View style={styles.infoRow}>
          <Ionicons name="mail-outline" size={20} color="#0B7784" style={styles.icon} />
          <Text style={styles.infoText}>{userData?.email}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="call-outline" size={20} color="#0B7784" style={styles.icon} />
          <Text style={styles.infoText}>{userData?.phoneNumber}</Text>
        </View>
      </View>

      {/* Edit Button */}
      <TouchableOpacity style={styles.editBtn} onPress={handleEditClick}>
        <Text style={styles.editBtnText}>Edit</Text>
      </TouchableOpacity>
      {/* Friends Section */}
      <View style={styles.friendsSection}>
        <Text style={styles.subTitle}>Friends</Text>
        <Text style={styles.friendCount}>You have {friendsList.length} friends</Text>
        <FlatList
          data={friendsList}
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

      {/* Modal for Editing User Details */}
      <Modal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        transparent={true}
        animationType="slide"
      >
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
              />
            </View>

            <View style={styles.textFieldContainer}>
              <TextInput
                style={styles.input}
                value={editedValues.email}
                onChangeText={(text) => setEditedValues({ ...editedValues, email: text })}
                placeholder="Email"
                placeholderTextColor="#fff"
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#0B7784',
    marginBottom: 10,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  profileUsername: {
    fontSize: 18,
    color: '#888',
  },
  userInfo: {
    marginBottom: 20,
    backgroundColor: '#f7f7f7',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  icon: {
    marginRight: 10,
  },  
  editBtn: {
    backgroundColor: '#0B7784',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    alignSelf: 'center',
  },
  editBtnText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
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