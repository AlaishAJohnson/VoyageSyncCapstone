import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { format } from 'date-fns';

const Booking = () => {
  const router = useRouter();
  const { id, name, openSlots } = useLocalSearchParams();  
  const [selectedTrip, setSelectedTrip] = useState('');
  const [serviceDetails, setServiceDetails] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [userTrips, setUserTrips] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date);
  const [selectedTime, setSelectedTime] = useState('');
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);  

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

  useEffect(() => {
    getUserData();
    getUserId();
  }, []);
  useEffect(() => {
    const fetchUserTrips = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8080/api/trips/organizer/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Basic ${btoa('admin:admin')}`,
          },
        });
        const data = await response.json();
        if (data && Array.isArray(data.trips)) {
          setUserTrips(data.trips);

        } else {
          console.error('No trips data found');
        }
      } catch (error) {
        console.error("Error fetching user trips:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserTrips();
    }
  }, [userId]);

  const generateAvailableDates = (startDate, endDate) => {
    const dateArray = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
  
    let currentDate = start;
    while (currentDate <= end) {
      dateArray.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1); 
    }
  
    return dateArray;
  };

  const generateAvailableTimes = (timeFrame, duration) => {
    console.log("Generating available times with timeFrame:", timeFrame, "and duration:", duration);
  
    const [start, end] = timeFrame.replace('From ', '').split(' to ').map(time => {
      const match = time.match(/(\d{1,2})(AM|PM)/i);  
      if (!match) {
        console.error("Invalid time format:", time);
        return null;
      }
      const [hour, period] = match.slice(1, 3);
      const date = new Date();
      date.setHours(parseInt(hour) + (period === 'PM' && parseInt(hour) !== 12 ? 12 : 0), 0); 
      return date;
    });
  
    if (!start || !end) {
      console.error("Invalid start or end time:", start, end);
      return [];
    }
  
    const durationMatch = duration.match(/(\d+)hr/i);
    if (!durationMatch) {
      console.error("Invalid duration format:", duration);
      return [];
    }
    const durationInHours = parseInt(durationMatch[1]);
    const durationInMs = durationInHours * 60 * 60 * 1000;
  
    const availableTimes = [];
  
    let currentTime = new Date(start);
    while (currentTime.getTime() + durationInMs <= end.getTime()) {  
      availableTimes.push(new Date(currentTime));
      currentTime = new Date(currentTime.getTime() + durationInMs);
    }
  
    console.log("Generated Available Times:", availableTimes);
    return availableTimes;
  };

  useEffect(() => {
    if (selectedTrip) {
      if (selectedTrip.length === 24 && /^[a-fA-F0-9]{24}$/.test(selectedTrip)) {
        const fetchServiceDetails = async () => {
          setLoading(true);
          try {
            const response = await fetch(`http://localhost:8080/api/services/${id}`, {
              method: 'GET',
              headers: {
                'Authorization': `Basic ${btoa('admin:admin')}`,
              },
            });
            const data = await response.json();
            setServiceDetails(data);
            setAvailableTimes(generateAvailableTimes(data.timeFrame, data.duration));
  
          } catch (error) {
            console.error("Error fetching service details:", error);
          } finally {
            setLoading(false);
          }
        };
        
        const fetchSelectedTrip = async () => {
          setLoading(true);
          try {
            const response = await fetch(`http://localhost:8080/api/trips/${selectedTrip}`, {
              method: 'GET',
              headers: {
                'Authorization': `Basic ${btoa('admin:admin')}`,
              },
            });
            const data = await response.json();
        
            console.log("Fetched Trip Data:", data);
        
            if (data && data.trips && data.trips.length > 0) {
              const trip = data.trips[0]; 
              setUserTrips(data.trips);
              
              const startDate = new Date(trip.startDate); 
              const endDate = new Date(trip.endDate); 
        
              console.log("Trip Start Date:", startDate, "Trip End Date:", endDate);
              
              setAvailableDates(generateAvailableDates(startDate, endDate));
            } else {
              console.error('No trip data found');
            }
          } catch (error) {
            console.error("Error fetching user trips:", error);
          } finally {
            setLoading(false);
          }
        };
  
        fetchServiceDetails();
        fetchSelectedTrip();
  
      } else {
        console.error('Invalid trip ID:', selectedTrip);
        setServiceDetails(null);
      }
    }
  }, [selectedTrip]); 

 

  const handleBookingSubmit = async () => {
    const bookingData = {
      serviceId: id,
      vendorId: serviceDetails.vendorId,  
      itineraryId: itineraryId,     
      bookingDate: selectedDate,
      bookingTime: selectedTime,
      confirmationStatus: 'PENDING',
      numberOfParticipants: openSlots,
    };
  
    try {
      const response = await fetch('http://localhost:8080/api/bookings/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${btoa('admin:admin')}`,
        },
        body: JSON.stringify(bookingData),
      });
  
      const result = await response.json();
      if (response.ok) {
        console.log('Booking created:', result);
        router.push(`/bookings/confirmation?id=${result.bookingId}`);
      } else {
        console.error('Failed to create booking:', result.message);
      }
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };

  useEffect(() => {
    if (serviceDetails && selectedDate) {
      const { timeFrame, duration } = serviceDetails; 
  
      const [startTime, endTime] = timeFrame.split(' to ').map(time => {
        const [hour, minute] = time.split(':').map(Number);
        const date = new Date(selectedDate);
        date.setHours(hour, minute, 0);
        return date;
      });
  
      if (startTime && endTime) {
        const availableTimeSlots = [];
        let currentTime = startTime;
        while (currentTime <= endTime) {
          availableTimeSlots.push(new Date(currentTime)); 
          currentTime = new Date(currentTime.getTime() + duration * 60 * 60 * 1000); 
        }
        
        setAvailableTimes(availableTimeSlots);
      }
    }
  }, [selectedDate, serviceDetails]); // Remove availableTimes from dependencies

const handleTimeSelect = (time) => {
  setSelectedTime(time);
};


const renderTimeButton = (time) => {
  const isActive = selectedTime === time.toISOString(); 
  return (
    <TouchableOpacity
      key={time.toISOString()} 
      style={[styles.timeButton, isActive && styles.activeTime]}
      onPress={() => handleTimeSelect(time)}
    >
      <Text style={[styles.timeText, isActive && styles.activeTimeText]}>
        {format(time, 'h:mm a')}  // Use date-fns format
      </Text>
    </TouchableOpacity>
  );
};


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Book {name}</Text>

      {/* Loading indicator */}
      {loading && <ActivityIndicator size="large" color="#0B7784" />}

      <View style={styles.container}>
        {userTrips.length > 0 ? (
          <Picker
          selectedValue={selectedTrip}
          onValueChange={(itemValue) => {
            console.log('Selected Trip ID:', itemValue);  // Debugging
            setSelectedTrip(itemValue);
          }}
          style={styles.picker}
        >
            <Picker.Item label="Select Your Trip" value="" key="default" />
            {userTrips.map((trip, index) => {
              const tripId = trip.tripId ? trip.tripId.toString() : ''; 
              const tripName = trip.tripName || "Unnamed Trip";
              return (
                <Picker.Item 
                  key={tripId} 
                  label={tripName} 
                  value={tripId}  
                />
              );
            })}
          </Picker>
        ) : (
          <Text style={styles.location}>No trips available.</Text>
        )}
      </View>

      {/* Available Dates */}
      {selectedTrip && (
        <View style={styles.datesSection}>
          <Text style={styles.datesHeader}>Available Dates</Text>
          <View style={styles.datesList}>
            {availableDates.length > 0 ? (
              availableDates.map((date, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.dateButton, selectedDate === date.toISOString() && styles.activeDate]}
                  onPress={() => setSelectedDate(date.toISOString())}
                >
                  <Text style={[styles.dateText, selectedDate === date.toISOString() && styles.activeDateText]}>
                    {date.toLocaleDateString()}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text>No available dates</Text>
            )}
          </View>
        </View>
      )}

      {/* Available Times */}
      <View style={styles.timesSection}>
        <Text style={styles.timesHeader}>Available Times</Text>
        <View style={styles.timesList}>
          {availableTimes.map((time) => renderTimeButton(time))}
        </View>
      </View>

      {/* Booking Button */}
      <TouchableOpacity
        style={[styles.bookButton, selectedTrip && selectedDate && selectedTime ? styles.tripSelected : styles.tripNotSelected]}
        onPress={handleBookingSubmit}
        disabled={!selectedTrip || !selectedDate || !selectedTime}
      >
        <Text style={styles.bookButtonText}>Confirm Booking</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
    color: '#333',
  },
  location: {
    fontSize: 18,
    marginVertical: 10,
    color: '#666',
    textAlign: 'center',
  },
  picker: {
    height: 50,
    width: '100%',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: -50,
    paddingHorizontal: 10,
  },
  datesSection: {
    marginBottom: 20,
  },
  availableContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  }, 
  line: {
    height: 2,
    width: 100,
    backgroundColor: 'black',
  },
  datesHeader: {
    textAlign: 'center',
    fontSize: 20,
    marginVertical: 5,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 5,
    fontWeight: 'bold'
  },
  datesList: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  dateButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#0B7784',
    borderRadius: 10,
    margin: 5,
  },
  activeDate: {
    backgroundColor: '#0B7784',
  },
  dateText: {
    fontSize: 16,
    color: '#000',
  },
  activeDateText: {
    color: '#fff',
  },
  timesSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  timesHeader: {
    textAlign: 'center',
    fontSize: 20,
    marginVertical: 10,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 5,
    paddingVertical: 5,
    fontWeight: 'bold'
  },
  timesList: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  timeButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#0B7784',
    borderRadius: 10,
    margin: 5,
  },
  activeTime: {
    backgroundColor: '#0B7784',
  },
  timeText: {
    fontSize: 16,
    color: '#000',
  },
  activeTimeText: {
    color: '#fff',
  },
  bookButton: {
    width: '100%',
    height: 60,
    backgroundColor: '#0B7784',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    marginBottom: 15,
  },
  bookButtonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  }
});


export default Booking;