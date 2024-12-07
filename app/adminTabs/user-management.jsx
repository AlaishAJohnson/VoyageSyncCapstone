import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const UserManagement = () => {
  const [usersData, setUsersData] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const authHeader = 'Basic ' + btoa('admin:admin'); 
        const response = await fetch('http://localhost:8080/api/users/', {
          method: 'GET', 
          headers: {
            'Content-Type': 'application/json',
            Authorization: authHeader,
          },
        });
  
        if (!response.ok) {
          console.error('Error fetching users: HTTP status', response.status);
          return;
        }
  
        const data = await response.json();
        if (Array.isArray(data)) {
          setUsersData(data);
          setFilteredUsers(data);
        } else {
          console.error('Data is not in the expected array format:', data);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
  
    fetchUsers();
  }, []);
  

  useEffect(() => {
    
    const roleFiltered = selectedRole
      ? usersData.filter(user => user.role === selectedRole)
      : usersData;

    setFilteredUsers(roleFiltered);
  }, [selectedRole, usersData]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    const searchFiltered = usersData.filter(user =>
      user.firstName.toLowerCase().includes(query.toLowerCase()) ||
      user.lastName.toLowerCase().includes(query.toLowerCase()) ||
      user.username.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredUsers(searchFiltered);
  };

  const renderUser = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => {
        console.log("Navigating to user profile with ID:", item.userId);
        router.push(`/components/${item.userId}`); 
      }} 
    >
      <Image source={{ uri: item.profileImage }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardName}>{item.firstName} {item.lastName}</Text>
        <Text style={styles.cardUsername}>{item.username}</Text>
      </View>
    </TouchableOpacity>
  );
  
  

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
        {['Admin', 'Vendor', 'User'].map(role => (
          <TouchableOpacity 
            key={role} 
            style={[styles.roleButton, selectedRole === role && styles.activeRole]}
            onPress={() => setSelectedRole(selectedRole === role ? null : role)}
          >
            <Text style={styles.roleButtonText}>{role}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={filteredUsers}
        renderItem={renderUser}
        keyExtractor={(item) => item.userId}
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
  cardFriendText: {
    fontSize: 12,
    color: '#666',
  },
});

export default UserManagement;
