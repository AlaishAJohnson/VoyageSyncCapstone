import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

const BookingConfirmation = () => {
  const { id, name, trip, date, time } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Booking Confirmed!</Text>
      <Text style={styles.detailsText}>{name} has been booked for:</Text>

      <View style={styles.infoRow}>
        <Ionicons name="location-outline" size={24} color="#0B7784" style={styles.icon} />
        <Text style={styles.infoText}>Trip: {trip}</Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="calendar-outline" size={24} color="#0B7784" style={styles.icon} />
        <Text style={styles.infoText}>Date: {date}</Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="time-outline" size={24} color="#0B7784" style={styles.icon} />
        <Text style={styles.infoText}>Time: {time}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    padding: 20,
    backgroundColor: '#fff', // Optional: set a background color
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FE9F67', // Change the color as needed
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
    marginRight: 8, // Space between the icon and the text
  },
  infoText: {
    fontSize: 16,
    color: '#333',
  },
});

export default BookingConfirmation;
