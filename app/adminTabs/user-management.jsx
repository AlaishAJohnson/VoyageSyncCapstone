import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import axios from 'axios';
import { getAuthHeader } from './auth.jsx';

const UserManagement = () => {
  const [usersData, setUsersData] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Fetch users from the database
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/users/', getAuthHeader()); // Replace with your backend API
        setUsersData(response.data);
        setFilteredUsers(response.data);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to fetch users. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);
  // Filter users by role
  useEffect(() => {
    const roleFiltered = selectedRole
        ? usersData.filter(user => user.role === selectedRole)
        : usersData;

    setFilteredUsers(roleFiltered);
  }, [selectedRole, usersData]);

  // Search users
  const handleSearch = (query) => {
    setSearchQuery(query);
    const searchFiltered = usersData.filter(user =>
        user.firstName.toLowerCase().includes(query.toLowerCase()) ||
        user.username.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredUsers(searchFiltered);
  };

  const renderUser = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.card,
        item.verificationStatus === 'REJECTED' && styles.rejectedCard, // Apply red hue if status is 'rejected'
      ]}
      onPress={() => router.push(`/components/${item.id}`)}
    >
      <View style={styles.cardContent}>
        <Text style={styles.cardName}>{item.firstName} {item.lastName}</Text>
        <Text style={styles.cardUsername}>{item.username}</Text>
  
        {item.verificationStatus === 'REJECTED' && (
          <Text style={styles.rejectedLabel}>Rejected</Text>
        )}
  
        {/* Action Buttons */}
        {item.role !== 'ADMIN' && ( // Exclude buttons if the role is admin
          <View style={styles.actionButtons}>
            {(item.verificationStatus === 'PENDING' || item.verificationStatus === 'REJECTED') && (
              <TouchableOpacity
                style={styles.verifyButton}
                onPress={() => handleAction(item.userId, 'verify')}
              >
                <Text style={styles.buttonText}>Verify</Text>
              </TouchableOpacity>
            )}
            {item.verificationStatus === 'PENDING' && (
              <TouchableOpacity
                style={styles.rejectButton}
                onPress={() => handleAction(item.userId, 'reject')}
              >
                <Text style={styles.buttonText}>Reject</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[
                styles.activationButton,
                item.activated ? styles.deactivateButton : styles.activateButton,
              ]}
              onPress={() => handleAction(item.userId, item.activated ? 'deactivate' : 'activate')}
            >
              <Text style={styles.buttonText}>
                {item.activated ? 'Deactivate' : 'Activate'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleAction(item.userId, 'remove')}
            >
              <Text style={styles.buttonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
  

  const handleAction = async (userId, action) => {
    console.log(`Action: ${action}, UserId: ${userId}`);
    try{
      const headers = {
        'Content-Type': 'application/json',
        ...await getAuthHeader()
      };

      switch (action) {
        case 'verify':
          await axios.put(`http://localhost:8080/api/admins/${userId}/verification-status?newStatus=VERIFIED`, {headers});
          Alert.alert('Confirmation', `Do you want to verify user ${userId}?`, [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Yes', onPress: () => Alert.alert('User Verified', `User ${userId} has been verified.`) },
          ]);
          break;
        case 'reject':
          await axios.put(`http://localhost:8080/api/admins/${userId}/verification-status?newStatus=REJECTED`, {headers});
          Alert.alert('User Rejected', `User ${userId} has been rejected.`);
          break;
        case 'remove':
          await axios.delete(`http://localhost:8080/api/admins/delete/${userId}`, {headers});
          Alert.alert('User Removed', `User ${userId} has been removed.`);
          break;
        case 'activate':
          await axios.put(`http://localhost:8080/api/users/${userId}/activation?activated=true`, {}, { headers });
          Alert.alert('User Activated', `User ${userId} has been activated.`);
          break;
        case 'deactivate':
          await axios.put(`http://localhost:8080/api/users/${userId}/activation?activated=false`, {}, { headers });
          Alert.alert('User Deactivated', `User ${userId} has been deactivated.`);
          break;
        default:
          console.error('Unknown action:', action);
      }
    } catch (error) {
      console.error('Error while performing action:', error);
      Alert.alert('Error', `There was an error performing the action. Please try again.`);
    }
  };

  if (loading) {
    return (
        <SafeAreaView style={styles.container}>
          <ActivityIndicator size="large" color="#0B7784" />
        </SafeAreaView>
    );
  }

  if (error) {
    return (
        <SafeAreaView style={styles.container}>
          <Text style={styles.errorText}>{error}</Text>
        </SafeAreaView>
    );
  }

  return (
      <SafeAreaView style={styles.container}>
        <View style={styles.searchContainer}>
          <Ionicons name='search' color='black' size={20} />
          <TextInput
              placeholder='Search Users'
              placeholderTextColor="#333"
              value={searchQuery}
              onChangeText={handleSearch}
              style={styles.searchText}
          />
        </View>
        <View style={styles.roleFilterContainer}>
          {['admin', 'vendor', 'user'].map(role => (
              <TouchableOpacity
                  key={role}
                  style={[styles.roleButton, selectedRole === role && styles.activeRole]}
                  onPress={() => setSelectedRole(selectedRole === role ? null : role)}
              >
                <Text style={styles.roleButtonText}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </Text>
              </TouchableOpacity>
          ))}
        </View>
        <FlatList
            data={filteredUsers}
            renderItem={renderUser}
            keyExtractor={(item) => (item.userId ? item.userId.toString() : `key-${item.id}`)}
            style={styles.userList}
        />
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  searchContainer: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    height: 50,
  },
  searchText: {
    flex: 1,
    marginLeft: 10,
    color: '#333',
    fontSize: 16,
  },
  roleFilterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  roleButton: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  activeRole: {
    backgroundColor: '#e0e0e0',
  },
  roleButtonText: {
    fontSize: 16,
    color: '#333',
  },
  userList: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f6f6f6',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  cardImage: {
    margin: 10,
    width: 50,
    height: 50,
    borderRadius: 60,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 10,
    justifyContent: 'center',
  },
  cardName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardUsername: {
    fontSize: 14,
    color: '#555',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 10,
  },
  verifyButton: {
    backgroundColor: '#4CAF50', // Green
    padding: 8,
    borderRadius: 5,
    marginRight: 5,
  },
  rejectButton: {
    backgroundColor: '#FF5722', // Red
    padding: 8,
    borderRadius: 5,
    marginRight: 5,
  },
  removeButton: {
    backgroundColor: '#9E9E9E', // Grey
    padding: 8,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  rejectedLabel: {
    color: '#F44336',
    fontSize: 16,
    fontWeight: 'bold',
  },
  rejectedCard: {
    backgroundColor: '#ffe6e6',
  },
  activationButton: {
    padding: 8,
    borderRadius: 5,
    marginRight: 5,
  },
  activateButton: {
    backgroundColor: '#0B7784', // Yellow
  },
  deactivateButton: {
    backgroundColor: '#8E1600', // Light Orange
  },

});
export default UserManagement;
