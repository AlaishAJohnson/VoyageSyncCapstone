import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

// Sample user data (you will replace this with data from your database)
const usersData = [
  { id: '1', name: 'Alice Smith', username: 'alice123', role: 'User', profileImage: { uri: 'https://static.vecteezy.com/system/resources/previews/014/194/216/non_2x/avatar-icon-human-a-person-s-badge-social-media-profile-symbol-the-symbol-of-a-person-vector.jpg' } },
  { id: '2', name: 'Bob Johnson', username: 'bobbiej', role: 'Admin', profileImage: { uri: 'https://thumbs.dreamstime.com/b/unknown-male-avatar-profile-image-businessman-vector-unknown-male-avatar-profile-image-businessman-vector-profile-179373829.jpg' } },
  { id: '3', name: 'Charlie Brown', username: 'charlie_brown', role: 'Vendor', profileImage: { uri: 'https://png.pngtree.com/thumb_back/fh260/background/20230611/pngtree-an-avatar-of-a-man-with-a-beard-and-tie-image_2960737.jpg' } } // Add more users as needed
];

const UserManagement = () => {
  const [filteredUsers, setFilteredUsers] = useState(usersData);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState(null);

  useEffect(() => {
    // Filter users based on selected role
    const roleFiltered = selectedRole
      ? usersData.filter(user => user.role === selectedRole)
      : usersData;

    setFilteredUsers(roleFiltered);
  }, [selectedRole]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    const searchFiltered = usersData.filter(user =>
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.username.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredUsers(searchFiltered);
  };

  const renderUser = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => router.push('/components/[id]')}


    >
      <Image source={item.profileImage} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardName}>{item.name}</Text>
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
        keyExtractor={(item) => item.id}
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
    overflow: 'hidden'
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
});

export default UserManagement;
