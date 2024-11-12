import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const tripsData = [
  {
    _id: '6709890d60b3494e29ed5563',
    tripName: 'Bahamas',
    destination: 'The Bahamas',
    startDate: '2024-12-04T05:00:00.000+00:00',
    endDate: '2024-12-08T05:00:00.000+00:00',
    imageUrl: 'https://tempo.cdn.tambourine.com/windsong/media/windsong-gallery-12-5fb43a016cb8b.jpg',
    organizerId: 'user1',
  },
  {
    _id: '6709890d60b3494e29ed5564',
    tripName: 'Paris Getaway',
    destination: 'Paris, France',
    startDate: '2024-11-01T05:00:00.000+00:00',
    endDate: '2024-11-07T05:00:00.000+00:00',
    imageUrl: 'https://t4.ftcdn.net/jpg/02/96/15/35/360_F_296153501_B34baBHDkFXbl5RmzxpiOumF4LHGCvAE.jpg',
    organizerId: 'user2',
  },
  {
    _id: '6709890d60b3494e29ed5565',
    tripName: 'Mountain Hiking',
    destination: 'Swiss Alps',
    startDate: '2024-12-15T05:00:00.000+00:00',
    endDate: '2024-12-20T05:00:00.000+00:00',
    imageUrl: 'https://example.com/mountain.jpg',
    organizerId: 'user1',
  },
  {
    _id: '6709890d60b3494e29ed5566',
    tripName: 'Beach Retreat',
    destination: 'Maldives',
    startDate: '2024-11-15T05:00:00.000+00:00',
    endDate: '2024-11-22T05:00:00.000+00:00',
    imageUrl: 'https://example.com/maldives.jpg',
    organizerId: 'user3',
  },
];

const UserHome = () => {
  const [selectedTab, setSelectedTab] = useState('all');
  const router = useRouter();
  const userId = 'user1'; 
  const filteredTrips = tripsData.filter(trip => {
    if (selectedTab === 'participating') {
      return trip.organizerId !== userId;
    }
    if (selectedTab === 'organizing') {
      return trip.organizerId === userId;
    }
    return true; // For 'all' tab
  });

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
          data={filteredTrips}
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
