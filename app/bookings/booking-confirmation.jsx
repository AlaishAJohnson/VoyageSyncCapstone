import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import axios from 'axios';

const BACKEND_URL = 'http://localhost:8080';  

const BookingConfirmation = () => {
  const router = useRouter();
  const { id, name, trip, date: selectedDate } = useLocalSearchParams();
  
  const [tripDetails, setTripDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formattedDate = selectedDate
    ? new Date(selectedDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : null;

  useEffect(() => {
    if (trip) {
      fetchTrips();
    }
  }, [trip]);

  const fetchTrips = async () => {
    setLoading(true);
    setError(null);

    try {
      const authHeader = 'Basic ' + btoa('admin:admin');
      const response = await axios.get(`${BACKEND_URL}/api/trips/${trip}`, {
        headers: {
          'Authorization': authHeader,
        },
      });

      if (response.data && response.data.trips && response.data.trips.length > 0) {
        setTripDetails(response.data.trips[0]);
      } else {
        console.error('No trip data found');
        Alert.alert('Error', 'No trip data found');
      }
    } catch (err) {
      setError('Failed to fetch trip details');
      console.error('Error fetching trips:', err);
      Alert.alert('Error', 'Failed to fetch trip details');
    } finally {
      setLoading(false);
    }
  };

  const handleDone = () => {
    router.push('/userTabs/user-home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Booking Confirmed!</Text>
      <Text style={styles.detailsText}>{name} has been booked for:</Text>

      {tripDetails && (
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={24} color="#0B7784" style={styles.icon} />
          <Text style={styles.infoText}>Trip: {tripDetails.tripName}</Text>
        </View>
      )}

      <View style={styles.infoRow}>
        <Ionicons name="calendar-outline" size={24} color="#0B7784" style={styles.icon} />
        <Text style={styles.infoText}>Date: {formattedDate}</Text>
      </View>

      <TouchableOpacity
        style={styles.doneButton}
        onPress={handleDone}
      >
        <Text style={styles.doneButtonText}>Done</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FE9F67',
    marginBottom: 20,
    textAlign: 'center',
  },
  detailsText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  icon: {
    marginRight: 8,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
  },
  doneButton: {
    width: '100%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#0B7784',
    marginTop: 30,
  },
  doneButtonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default BookingConfirmation;
