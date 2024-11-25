import React, { useState } from "react";
import { View, Text, ScrollView, SafeAreaView, StyleSheet, TouchableOpacity } from "react-native";
import CalendarPicker from "react-native-calendar-picker";
import dayjs from "dayjs";
import { useRouter } from "expo-router";

const VendorBookings = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTab, setSelectedTab] = useState('confirmed'); 
  const router = useRouter();

  // Sample bookings data with start time
  const bookings = [
    { id: 1, date: '2024-11-25', time: '09:00', status: 'confirmed', customer: 'John Doe' },
    { id: 2, date: '2024-11-25', time: '09:00', status: 'unconfirmed', customer: 'Jane Doe' },
    { id: 3, date: '2024-11-25', time: '12:00', status: 'confirmed', customer: 'Alice Smith' },
    { id: 4, date: '2024-11-25', time: '12:00', status: 'unconfirmed', customer: 'Bob Brown' },
    { id: 5, date: '2024-11-25', time: '15:00', status: 'confirmed', customer: 'Charlie Black' },
    { id: 6, date: '2024-11-24', time: '09:00', status: 'confirmed', customer: 'Sarah White' },
  ];

  // Filter bookings for the selected date
  const filteredBookings = bookings.filter((booking) =>
    dayjs(booking.date).isSame(selectedDate, 'day')
  );

  // Separate the bookings into confirmed and unconfirmed
  const confirmedBookings = filteredBookings.filter(
    (booking) => booking.status === 'confirmed'
  );
  const unconfirmedBookings = filteredBookings.filter(
    (booking) => booking.status === 'unconfirmed'
  );

  // Function to handle date selection from CalendarPicker
  const handleDateChange = (date) => {
    setSelectedDate(dayjs(date).format('YYYY-MM-DD')); // Store selected date in 'YYYY-MM-DD' format
  };
  const handleBookingClick = (bookingId) => {
    router.push(`vendor-components/booking-info?id=${bookingId}`); // Navigate to booking-info with the booking ID as a query param
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Vendor Bookings</Text>
      
      {/* Calendar Picker */}
      <View style={styles.calendarContainer}>
        <CalendarPicker 
          onDateChange={handleDateChange}
          minDate={Date.now}
          todayBackgroundColor="#46A6B5"
          selectedDayColor="#0B77846"
          selectedDayTextColor="#FFFFFF"
        />
      </View>
      
      {/* Show bookings for selected date */}
      {selectedDate && (
        <>
          <Text style={styles.selectedDateText}>
            Bookings for: {selectedDate}
          </Text>
          
          {/* Tab Buttons for Filtering */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tabButton, selectedTab === 'confirmed' ? styles.activeTab : styles.inactiveTab]}
              onPress={() => setSelectedTab('confirmed')}
            >
              <Text style={styles.tabText}>Confirmed</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabButton, selectedTab === 'unconfirmed' ? styles.activeTab : styles.inactiveTab]}
              onPress={() => setSelectedTab('unconfirmed')}
            >
              <Text style={styles.tabText}>Unconfirmed</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.bookingsContainer}>
            {/* Display Confirmed Bookings */}
            {selectedTab === 'confirmed' && confirmedBookings.length > 0 && (
              <View style={styles.bookingSection}>
                <Text style={styles.sectionTitle}>Confirmed</Text>
                {confirmedBookings.map((booking) => (
                  <TouchableOpacity
                    key={booking.id}
                    style={styles.bookingItem}
                    onPress={() => handleBookingClick(booking.id)} // Make booking item clickable
                  >
                    <Text>Time: {booking.time}</Text>
                    <Text>Customer: {booking.customer}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Display Unconfirmed Bookings */}
            {selectedTab === 'unconfirmed' && unconfirmedBookings.length > 0 && (
              <View style={styles.bookingSection}>
                <Text style={styles.sectionTitle}>Unconfirmed</Text>
                {unconfirmedBookings.map((booking) => (
                  <TouchableOpacity
                    key={booking.id}
                    style={styles.bookingItem}
                    onPress={() => handleBookingClick(booking.id)} // Make booking item clickable
                  >
                    <Text>Time: {booking.time}</Text>
                    <Text>Customer: {booking.customer}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Message if no bookings for the selected date */}
            {confirmedBookings.length === 0 && unconfirmedBookings.length === 0 && (
              <Text>No bookings for this date.</Text>
            )}
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  calendarContainer: {
    backgroundColor: 'rgba(11, 119, 132, 0.2)',
    padding: 20,
    borderRadius: 10,
    margin: 10
  },
  selectedDateText: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  bookingsContainer: {
    marginTop: 20,
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
  bookingSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 5,
  },
  bookingItem: {
    padding: 15, 
    backgroundColor: '#fff',
    margin: 10, 
    borderRadius: 15, 
    borderColor: '#ddd',
    borderWidth: 1,
    height: 100, 
    justifyContent: 'center', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});

export default VendorBookings;
