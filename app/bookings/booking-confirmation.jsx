import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';

const BookingConfirmation = () => {
  const router = useRouter();
  const { id, name, trip, date: selectedDate, time: selectedTime } = useLocalSearchParams();

  // Format date and time
  const formattedDate = selectedDate
    ? new Date(selectedDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : null;

  // Extract time from the selectedTime ISO string
  const timePart = selectedTime ? selectedTime.split('T')[1] : null; // Get the time part
  const formattedTime = timePart
    ? new Date(`1970-01-01T${timePart}`).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })
    : null;

  const handleDone = () => {
    
    router.push('/userTabs/user-home'); 
  };

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
        <Text style={styles.infoText}>Date: {formattedDate}</Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="time-outline" size={24} color="#0B7784" style={styles.icon} />
        <Text style={styles.infoText}>Time: {formattedTime}</Text>
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
