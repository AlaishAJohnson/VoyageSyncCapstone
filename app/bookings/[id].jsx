import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ActivityDetail = () => {
  const router = useRouter();
  const { id, name, type, budget } = useLocalSearchParams(); 

  // Sample available dates and times
  const availableDates = ['October 30', 'October 31', 'November 1'];
  const availableTimes = {
    'October 30': ['10:00 AM', '2:00 PM', '6:00 PM'],
    'October 31': ['11:00 AM', '3:00 PM', '5:00 PM'],
    'November 1': ['12:00 PM', '4:00 PM', '7:00 PM'],
  };

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHNraXxlbnwwfHwwfHx8MA%3D%3D' }} // Replace with your image URL
        style={styles.image}
      />
      <Text style={styles.title}>{name}</Text>
      <Text style={styles.description}>Type: {type}</Text>
      <View style={styles.priceContainer}>
        <Ionicons name="cash-outline" size={23} color="#FE9F67" />  
        <Text style={styles.priceText}>Price: ${budget}</Text>
      </View>

      <View style={styles.datesSection}>
        <View style={styles.availableContainer}>
          <View style={styles.line} />
          <Text style={styles.datesHeader}>Available Dates</Text>
          <View style={styles.line} />
        </View>
        <View style={styles.datesList}>
            {availableDates.map((date) => (
              <TouchableOpacity 
                key={date} 
                style={[styles.dateButton, selectedDate === date && styles.activeDate]}
                onPress={() => {
                  setSelectedDate(date);
                  setSelectedTime(null); // Reset selected time when a new date is picked
                }}
              >
                <Text style={[styles.dateText, selectedDate === date && styles.activeDateText]}>
                  {date}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
    </View>

    {selectedDate && (
      <View style={styles.timesSection}>
        <Text style={styles.timesHeader}>{`Times for ${selectedDate}`}</Text>
        <View style={styles.timesList}>
          {availableTimes[selectedDate].map((time) => (
            <TouchableOpacity 
              key={time} 
              style={[styles.timeButton, selectedTime === time && styles.activeTime]} 
              onPress={() => setSelectedTime(time)} 
            >
              <Text style={[styles.timeText, selectedTime === time && styles.activeTimeText]}>{time}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    )}


      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => router.push(`/bookings/booking?id=${id}&name=${name}&type=${type}`)}
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

