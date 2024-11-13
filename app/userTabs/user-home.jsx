import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserHome = () => {
  const [selectedTab, setSelectedTab] = useState('all');
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);  // State to store userId
  const router = useRouter();

  // Function to fetch user data and userId from AsyncStorage
  const getUserData = async () => {
    const userData = await AsyncStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      console.log(user);  // Use the user data here
    }
  };

  const getUserId = async () => {
    const storedUserId = await AsyncStorage.getItem('userId');
    console.log(storedUserId);  // Use the user ID here
    if (storedUserId) {
      setUserId(storedUserId);  // Store userId in state
    }
  };

  // Fetch trips based on the selected tab
  const fetchTrips = async (tab) => {
    if (!userId) {
      console.error('User ID is not available');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let url = '';
      const userId = await AsyncStorage.getItem('userId');
      const authHeader = 'Basic ' + btoa('user:2054e07b-c906-4c41-8444-011e2cb7448f'); 
      // Determine the URL based on the selected tab
      if (tab === 'all') {
        url = `https://1daa-68-234-200-22.ngrok-free.app/api/trips/organizer-member/${userId}`; // All trips where the user is a member
      } else if (tab === 'organizing') {
        url = `https://1daa-68-234-200-22.ngrok-free.app/api/trips/organizer/${userId}`; // Trips where the user is the organizer
      } else if (tab === 'participating') {
        url = `https://1daa-68-234-200-22.ngrok-free.app/api/trips/member/${userId}`; // Trips where the user is a member, but not the organizer
      }

      // Make the request to the backend
      const response = await axios.get(url, {
        headers: {
          'Authorization': authHeader,
        },
      });
  
      const tripsData = response.data;

      // Filter trips if necessary based on the tab
      if (tab === 'participating') {
        setTrips(tripsData.filter(trip => trip.organizerId !== userId)); // Exclude trips where the user is the organizer
      } else {
        setTrips(tripsData);
      }
    } catch (err) {
      setError('Failed to fetch trips');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user data and userId on component mount
  useEffect(() => {
    getUserData();
    getUserId();  // Fetch the userId and update state
  }, []);

  // Fetch trips whenever the selected tab changes
  useEffect(() => {
    if (userId) {
      fetchTrips(selectedTab);
    }
  }, [selectedTab, userId]);

  const onTripPress = (trip) => {
    router.push({ pathname: '/trip/trip-details', params: { tripId: trip._id } });
  };

  const renderImage = (uri) => {
    return (
      <Image
        source={{ uri }}
        style={styles.image}
        onError={() => {/* Handle error case, e.g., set a default image */}}
      />
    );
  };

  const handleCreateTrip = () => {
    router.push('/trip/create-trip'); // Adjust path as needed
  };

  // if (loading) {
  //   return (
  //     <SafeAreaView style={styles.safeArea}>
  //       <View style={styles.container}>
  //         <Text>Loading...</Text>
  //       </View>
  //     </SafeAreaView>
  //   );
  // }

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
          data={trips}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.card} 
              onPress={() => onTripPress(item)}
              accessibilityLabel={`View trip to ${item.destination}`}
              accessibilityHint="Tap to view trip details."
            >
              {renderImage(item.imageUrl)}
              <Text style={styles.title}>{item.tripName}</Text>
              <Text style={styles.date}>
                {new Date(item.startDate).toDateString()} - {new Date(item.endDate).toDateString()}
              </Text>
            </TouchableOpacity>
          )}
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
  },
});

export default UserHome;