import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Picker } from '@react-native-picker/picker';

const Booking = () => {
  const router = useRouter();
  const { id, name, date: selectedDate, time: selectedTime } = useLocalSearchParams(); // Retrieve date and time from parameters
  const [selectedTrip, setSelectedTrip] = useState('');

  const isGroupTrip = selectedTrip && selectedTrip.includes('Group'); // Example condition for a group trip
  const isTripSelected = !!selectedTrip; // Ensure selectedTrip is not empty

  const handleBooking = () => {
    if (isTripSelected) {
      router.push(`/bookings/booking-confirmation?id=${id}&name=${name}&trip=${selectedTrip}&date=${selectedDate}&time=${selectedTime}`);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Book {name}</Text>
      
      {selectedDate && selectedTime ? (
        <>
          <Text style={styles.detailText}>Date: {selectedDate}</Text>
          <Text style={styles.detailText}>Time: {selectedTime}</Text>
        </>
      ) : (
        <Text style={styles.warningText}>Please make sure to select a date and time on the previous page.</Text>
      )}

      <Picker
        selectedValue={selectedTrip}
        onValueChange={(itemValue) => setSelectedTrip(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select Your Trip" value="" />
        <Picker.Item label="Group Trip to Paris" value="Group Paris" />
        <Picker.Item label="Solo Trip to New York" value="Solo New York" />
        <Picker.Item label="Group Trip to Tokyo" value="Group Tokyo" />
      </Picker>

      {isGroupTrip && (
        <Text style={styles.groupNote}>
          Note: If the trip you selected is a group trip, your group will have to vote before you get a confirmation.
        </Text>
      )}

      <TouchableOpacity
        style={[styles.bookButton, isTripSelected ? styles.tripSelected : styles.tripNotSelected]}
        onPress={handleBooking}
        disabled={!isTripSelected}
      >
        <Text style={styles.bookButtonText}>Confirm Booking</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 10,
  },
  warningText: {
    fontSize: 14,
    color: 'red',
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 10,
    backgroundColor: '#f0f0f0', 
  },
  groupNote: {
    color: '#FE9F67',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 150,
    marginBottom: -180, 
  },
  bookButton: {
    width: '100%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginBottom: 15,
  },
  tripSelected: {
    backgroundColor: '#0B7784',
    marginTop: 200
  },
  tripNotSelected: {
    backgroundColor: '#ddd',
    marginTop: 200
  },
  bookButtonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Booking;

