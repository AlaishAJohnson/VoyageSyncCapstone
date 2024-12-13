import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import defaultImage from '../../assets/defaultImage.jpeg'; 

const UserHome = () => {
  const [selectedTab, setSelectedTab] = useState('all');
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const router = useRouter();
  const BACKEND_URL = "http://localhost:8080"

  const getUserData = async () => {
    const userData = await AsyncStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
    }
  };

  const getUserId = async () => {
    const storedUserId = await AsyncStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
      console.log('User ID:', storedUserId);
    }
  };

  const fetchTrips = async (tab) => {
    if (!userId) {
      console.error('User ID is missing, cannot fetch trips');
      return;
    }
  
    setLoading(true);
    setError(null); 
  
    try {
      let url = '';
      const authHeader = 'Basic ' + btoa('admin:admin'); 
      console.log('Selected Tab:', tab);  
      
      if (tab === 'all') {
        url = `${BACKEND_URL}/api/trips/organizer-member/${userId}`;
        console.log('All Trips URL:', url); 
      } else if (tab === 'organizing') {
        url = `${BACKEND_URL}/api/trips/organizer/${userId}`;
        console.log('Organizing Trips URL:', url); 
      } else if (tab === 'participating') {
        url = `${BACKEND_URL}/api/trips/member/${userId}`;
        console.log('Participating Trips URL:', url); 
      }
  
      if (!url) {
        console.error('No valid URL constructed!');
        return;
      }

      const response = await axios.get(url, {
        headers: {
          'Authorization': authHeader,
        },
      });
  
    
  
      const tripsData = Array.isArray(response.data.trips) ? response.data.trips : [];
  
      
      if (tab === 'participating') {
        setTrips(tripsData.filter((trip) => trip.organizerId !== userId));
      } else {
        setTrips(tripsData);  
      }
  
    } catch (err) {
      setError('Failed to fetch trips');
      console.error('Error fetching trips:', err);
      Alert.alert('Error', 'Failed to fetch trips');
    } finally {
      setLoading(false);
    }
  }; 
 
  useEffect(() => {
    getUserData();
    getUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchTrips(selectedTab);
    }
  }, [selectedTab, userId]);

  const renderImage = (trip) => {
    const imageUri = trip.imageUrl ? { uri: trip.imageUrl } : defaultImage;
    return (
      <Image
        source={imageUri}
        style={styles.image}
        onError={() => {/* Handle error case, e.g., set a default image */}}
      />
    );
  };

  const onTripPress = (trip) => {
    console.log('Trip ID pressed:', trip.tripId);
    router.push(`/trip/${trip.tripId}?userId=${userId}`);
  };
  

  const handleCreateTrip = () => {
    router.push('/trip/create-trip');
  };

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Tab Buttons for Filtering */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, selectedTab === 'all' ? styles.activeTab : styles.inactiveTab]}
            onPress={() => setSelectedTab('all')}
          >
            <Text style={styles.tabText}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, selectedTab === 'organizing' ? styles.activeTab : styles.inactiveTab]}
            onPress={() => setSelectedTab('organizing')}
          >
            <Text style={styles.tabText}>Organizing</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, selectedTab === 'participating' ? styles.activeTab : styles.inactiveTab]}
            onPress={() => setSelectedTab('participating')}
          >
            <Text style={styles.tabText}>Participating</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={trips || []}
          keyExtractor={(item) => item.tripId?.toString() || Math.random().toString()}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.card} 
              onPress={() => onTripPress(item)}
              accessibilityLabel={`View trip to ${item.destination}`}
              accessibilityHint="Tap to view trip details."
            >
              {renderImage(item)}
              <Text style={styles.title}>{item.tripName}</Text>
              <Text style={styles.date}>
                {new Date(item.startDate).toDateString()} - {new Date(item.endDate).toDateString()}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
        />

        <TouchableOpacity style={styles.floatingButton} onPress={handleCreateTrip}>
          <Ionicons name="add" size={28} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingBottom: 0
  },
  container: {
    flex: 1,
    padding: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: '#0B7784', 
  },
  inactiveTab: {
    backgroundColor: 'lightgray', 
  },
  tabText: {
    color: '#fff', 
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: 'rgba(11, 119, 132, 0.2)',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 3, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 1,
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'cover', 
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    padding: 8,
  },
  date: {
    fontSize: 14,
    color: '#000',
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#FE9F67',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  }
});

export default UserHome;

