import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

const ActivityDetail = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [activity, setActivity] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);  // New state for selected time
  const [availableTimes, setAvailableTimes] = useState([]);

  useEffect(() => {
    const fetchActivityDetails = async () => {
      console.log('Service ID:', id);
      try {
        const response = await axios.get(`https://7514-68-234-200-22.ngrok-free.app/api/services/${id}`);
        console.log(response.data); 
        setActivity(response.data);
      } catch (error) {
        console.error('Error fetching activity details:', error.response?.data || error.message);
      }
    };

    fetchActivityDetails();
  }, [id]);

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  
    const availability = activity.serviceAvailability.find(
      (avail) => avail.dateOfService === date
    );
    if (availability) {
      setAvailableTimes([availability.timeOfService]); 
    } else {
      setAvailableTimes([]); 
    }
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  if (!activity) {
    return <Text>Loading...</Text>;
  }

  const { serviceName, serviceDescription, price, vendorBusinessName, averageRating, serviceAvailability } = activity;

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHNraXxlbnwwfHwwfHx8MA%3D%3D' }}
        style={styles.image}
      />
      <Text style={styles.title}>{serviceName}</Text>
      <Text style={styles.description}>Description: {serviceDescription}</Text>
      <View style={styles.priceContainer}>
        <Ionicons name="cash-outline" size={23} color="#FE9F67" />  
        <Text style={styles.priceText}>Price: ${price}</Text>
      </View>
      <View style={styles.ratingContainer}>
        {Array.from({ length: Math.round(averageRating) }).map((_, index) => (
          <Ionicons key={index} name="star" size={20} color="#FFD700" />
        ))}
      </View>

      <Text style={styles.vendorText}>Vendor: {vendorBusinessName}</Text>

      {serviceAvailability.length > 0 ? (
        <View style={styles.datesSection}>
          <Text style={styles.datesHeader}>Available Dates</Text>
          <View style={styles.datesList}>
            {serviceAvailability.map((date) => (
              <TouchableOpacity 
                key={date.dateOfService} 
                style={[styles.dateButton, selectedDate === date.dateOfService && styles.activeDate]}
                onPress={() => handleDateSelect(date.dateOfService)}
              >
                <Text style={[styles.dateText, selectedDate === date.dateOfService && styles.activeDateText]}>
                  {formatDate(date.dateOfService)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          {selectedDate && availableTimes.length > 0 && (
            <View style={styles.timesSection}>
              <Text style={styles.timesHeader}>Available Times</Text>
              <View style={styles.timesList}>
                {availableTimes.map((time, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.timeButton, selectedTime === time && styles.activeTime]} 
                    onPress={() => handleTimeSelect(time)} 
                  >
                    <Text style={[styles.timeText, selectedTime === time && styles.activeTimeText]}>
                      {new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>

                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>
      ) : (
        <Text>No available dates</Text>
      )}

      <TouchableOpacity
        style={styles.loginButton}
        onPress={() =>
          router.push(`/bookings/booking?id=${id}&name=${serviceName}&date=${selectedDate}&time=${selectedTime}`)
                
        }
        disabled={!selectedDate || !selectedTime}  // Disable if date or time is not selected
      >
        <Text style={styles.loginButtonText}>Book</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  }, 
  priceText: {
    marginLeft: 4,
    fontSize: 16,
  },
  ratingText: {
    fontSize: 16,
    marginVertical: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  vendorText: {
    fontSize: 16,
    marginVertical: 4,
  },
  datesSection: {
    marginBottom: 20,
  },
  availableContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  }, 
  line: {
    height: 2,
    width: 100,
    backgroundColor: 'black',
  },
  datesHeader: {
    textAlign: 'center',
    fontSize: 20,
    marginVertical: 10,
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
  loginButton: {
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
  loginButtonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ActivityDetail;