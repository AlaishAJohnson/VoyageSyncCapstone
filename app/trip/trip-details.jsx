import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';

const TripDetails = () => {
  const route = useRoute();  
  const { tripId } = route.params || {};  
  const [tripDetails, setTripDetails] = useState(null);
  const [loading, setLoading] = useState(true); 
  useEffect(() => {
    console.log('Trip ID from route:', tripId);  
    if (tripId) {
      fetchTripDetails(tripId);
    }
  }, [tripId]);

  const fetchTripDetails = async (tripId) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/trips/${tripId}`, {
        headers: {
          'Authorization': 'Basic ' + btoa('admin:admin'),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch trip details');
      }

      const data = await response.json();
      setTripDetails(data);
    } catch (error) {
      console.error('Error fetching trip details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>Loading trip details...</Text>
      </View>
    );
  }

  if (!tripDetails) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Error loading trip details. Please try again.</Text>
      </View>
    );
  }
  const hours = Array.from({ length: 24 }, (_, i) => {
    const hour = (i + 9) % 24; 
    return `${hour === 0 ? 12 : hour} ${hour < 12 ? 'AM' : 'PM'}`;
  });
  const onExitPress = () => {
    route.push('/userTabs/user-home')
  }
 
  return (
    <ScrollView>
      <View style={styles.container}>
        <Image
          source={{ uri: tripDetails.imageUrl }} 
          style={styles.topImage}
        />
        <View style={styles.overlay}>
          

          <View style={styles.tripDetails}>
            <Text style={styles.tripName}>{tripDetails.tripName}</Text>

            <View style={styles.locationContainer}>
              <Ionicons name="location-outline" size={20} color="#FE9F67" />
              <Text style={styles.destination}>{tripDetails.destination}</Text>
            </View>

            <View style={styles.calendarContainer}>
              <Ionicons name="calendar-outline" size={20} color="#FE9F67" />
              <Text style={styles.tripDate}>
                {new Date(tripDetails.startDate).toDateString()} - {new Date(tripDetails.endDate).toDateString()}
              </Text>
            </View>

            <View style={styles.statusContainer}>
              <View style={styles.statusItem}>
                <Ionicons name="cash-outline" size={20} color="#FE9F67" />
                <Text style={styles.statusText}>Budget: ${tripDetails.budget}</Text>
              </View>
              <View style={styles.statusItem}>
                <Ionicons name="time-outline" size={20} color="#FE9F67" />
                <Text style={styles.statusText}>Status: {tripDetails.tripStatus}</Text>
              </View>
            </View>

            <Text style={styles.membersHeader}>Members</Text>
            <View style={styles.membersLine} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {tripDetails.memberIds?.map((memberId, index) => (
                <View style={styles.memberContainer} key={memberId}>
                  <Ionicons name="star" size={16} color="gold" style={styles.starIcon} />
                  <Image source={{ uri: `https://example.com/${memberId}.jpg` }} style={styles.memberImage} />
                  <Text style={styles.memberName}>Member {index + 1}</Text>
                </View>
              ))}
            </ScrollView>

            <Text style={styles.membersHeader}>Itinerary</Text>
            <View style={styles.membersLine} />
            <View style={styles.itineraryContainer}>
              {tripDetails.itinerary?.map((activity, index) => (
                <View key={index} style={styles.itineraryCard}>
                  <Text style={styles.itineraryTitle}>{activity.title}</Text>
                  <Text style={styles.itineraryLocation}>{activity.location}</Text>
                  <Text style={styles.itineraryTime}>
                    {activity.startTime} - {activity.endTime}
                  </Text>
                  <View style={styles.priceContainer}>
                    <Text style={styles.price}>{activity.estimatedPrice}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topImage: {
    width: "100%",
    height: 600,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 16,
    marginTop: 60,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -100,
  },
  exitButton: {
    fontSize: 24,
    color: '#000',
    alignSelf: 'flex-end',
  },
  tripDetails: {
    marginBottom: 16,
  },
  tripName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  destination: {
    marginLeft: 4,
    fontSize: 16,
  },
  calendarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  tripDate: {
    marginLeft: 4,
    fontSize: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    marginLeft: 4,
    fontSize: 16,
  },
  membersHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  membersLine: {
    height: 2,
    backgroundColor: '#000',
    marginVertical: 8,
  },
  memberContainer: {
    alignItems: 'center',
    marginRight: 16,
    marginTop: 10
  },
  starIcon: {
    position: 'absolute',
    top: -8,
    right: -8,
  },
  memberImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  memberName: {
    marginTop: 4,
    fontSize: 14,
    textAlign: 'center',
  },
  itineraryContainer: {
    marginTop: 16,
  },
  itineraryCard: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  itineraryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0b7784'
  },
  itineraryLocation: {
    fontSize: 14,
    color: '#666',
  },
  itineraryTime: {
    fontSize: 14,
    color: '#666',
  },
  priceContainer: {
    marginTop: 4,
  },
  price: {
    fontWeight: 'bold',
    color: '#FE9F67',
  },
});

export default TripDetails;