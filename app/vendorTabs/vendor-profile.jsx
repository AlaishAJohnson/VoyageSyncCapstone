import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hook/auth'; 

const VendorProfile = () => {
  const router = useRouter();
  const { logout } = useAuth(); 

  const handleSignOut = () => {
    logout();  
    console.log("User signed out");
    router.push('/');  
  };

  return (
    <View style={styles.container}>
      <Text style={styles.message}>More stuff will be added here</Text>
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  message: {
    fontSize: 18,
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
  },
  signOutButton: {
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
    fontWeight: 'bold',
    fontSize: 16,
  },
});


export default VendorProfile

