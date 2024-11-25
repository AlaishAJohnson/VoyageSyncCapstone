import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CalendarPicker from 'react-native-calendar-picker';
import dayjs from 'dayjs';

const BookingInfo = () => {
  // Hardcoded booking data
  const [booking, setBooking] = useState({
    bookingId: '507c7f79bcf86cd7994f6c11',
    serviceId: 'Service 1',
    bookingDate: 1734134400000, // Example timestamp
    bookingTime: 1734152400000, // Example timestamp
    confirmationStatus: 'PENDING',
    attendees: 4,
  });

  // Modal visibility for rescheduling
  const [rescheduleModalVisible, setRescheduleModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');

  // Function to confirm booking
  const confirmBooking = () => {
    setBooking({ ...booking, confirmationStatus: 'CONFIRMED' });
    Alert.alert('Success', 'Booking confirmed!');
  };

  // Function to cancel booking
  const cancelBooking = () => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          onPress: () => {
            setBooking({ ...booking, confirmationStatus: 'CANCELLED' });
            Alert.alert('Cancelled', 'The booking has been cancelled.');
          },
        },
      ],
    );
  };

  // Function to reschedule booking
  const rescheduleBooking = () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert('Error', 'Please select a date and time for rescheduling.');
      return;
    }
    const newDate = dayjs(selectedDate).startOf('day').toDate().getTime();
    const [hours, minutes] = selectedTime.split(':').map(Number);
    const newTime = newDate + hours * 60 * 60 * 1000 + minutes * 60 * 1000;

    setBooking({
      ...booking,
      bookingDate: newDate,
      bookingTime: newTime,
      confirmationStatus: 'PENDING',
    });
    setRescheduleModalVisible(false);
    Alert.alert(
      'Rescheduled',
      'The booking has been rescheduled and is now pending confirmation.',
    );
  };

  // Formatting date and time for display
  const bookingDate = dayjs(booking.bookingDate).format('MMMM D, YYYY');
  const bookingTime = dayjs(booking.bookingTime).format('h:mm A');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.bookingInfo}>
        <Text style={styles.title}>Booking Details</Text>
        <Text>Booking ID: {booking.bookingId}</Text>
        <Text>Service: {booking.serviceId}</Text>
        <Text>Booking Date: {bookingDate}</Text>
        <Text>Booking Time: {bookingTime}</Text>
        <Text>Confirmation Status: {booking.confirmationStatus}</Text>
        <Text>Attendees: {booking.attendees}</Text>
      </View>

      {/* Action buttons */}
      {booking.confirmationStatus === 'PENDING' && (
        <>
          <Button title="Confirm Booking" onPress={confirmBooking} />
          <Button
            title="Reschedule"
            onPress={() => setRescheduleModalVisible(true)}
          />
        </>
      )}
      {booking.confirmationStatus === 'CONFIRMED' && (
        <>
          <Button
            title="Reschedule"
            onPress={() => setRescheduleModalVisible(true)}
          />
          <Button title="Cancel Booking" onPress={cancelBooking} />
        </>
      )}

      {/* Reschedule Modal */}
      <Modal
        visible={rescheduleModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Reschedule Booking</Text>
            <CalendarPicker onDateChange={setSelectedDate} />
            <View style={styles.timePicker}>
              <Text>Select Time:</Text>
              <Button
                title="9:00 AM"
                onPress={() => setSelectedTime('09:00')}
              />
              <Button
                title="12:00 PM"
                onPress={() => setSelectedTime('12:00')}
              />
              <Button
                title="3:00 PM"
                onPress={() => setSelectedTime('15:00')}
              />
            </View>
            <Button title="Reschedule" onPress={rescheduleBooking} />
            <Button
              title="Cancel"
              onPress={() => setRescheduleModalVisible(false)}
              color="red"
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  bookingInfo: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  timePicker: {
    marginVertical: 20,
  },
});

export default BookingInfo;
