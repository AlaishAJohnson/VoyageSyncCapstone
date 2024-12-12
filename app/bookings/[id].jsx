import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

const ActivityDetail = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [activity, setActivity] = useState(null);
  const [members, setMembers] = useState(1); // The number of members in the trip
  const [openSlots, setOpenSlots] = useState(0);

  useEffect(() => {
    const fetchActivityDetails = async () => {
      console.log('Service ID:', id);
      try {
        const authHeader = 'Basic ' + btoa('admin:admin');
    
        const response = await fetch(`http://localhost:8080/api/services/${id}`, {
          headers: {
            'Authorization': authHeader,
          },
        });
        const data = await response.json();
    
        console.log(data); 
        setActivity(data); 
        setOpenSlots(data.openSlots);  // Set available slots from the response
      } catch (error) {
        console.error('Error fetching activity details:', error.response?.data || error.message);
      }
    };
    
    fetchActivityDetails();
  }, [id]);

  const handleBook = () => {
    if (members > openSlots) {
      Alert.alert(
        'Not Enough Slots',
        `There are only ${openSlots} slots available, but you have ${members} members. Do you want to proceed with booking for ${openSlots} members?`,
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Booking cancelled'),
            style: 'cancel',
          },
          {
            text: 'Proceed',
            onPress: () => router.push(`/bookings/booking?id=${id}&name=${activity.serviceName}&slots=${openSlots}`),
          },
        ]
      );
    } else {
      router.push(`/bookings/booking?id=${id}&name=${activity.serviceName}&slots=${members}`);
    }
  };

  if (!activity) {
    return <Text>Loading...</Text>;
  }

  const { serviceName, serviceDescription, price, vendorBusinessName, averageRating, timeFrame, duration, location } = activity;

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
      <Text style={styles.vendorText}>Location: {location}</Text>
      <Text style={styles.timeFrameText}>Available Time: {timeFrame}</Text>
      <Text style={styles.durationText}>Duration: {duration}</Text>

      <View style={styles.slotSection}>
        <Text style={styles.slotHeader}>Available Slots</Text>
        <Text style={styles.slotText}>Slots Available: {openSlots}</Text>
        <View style={styles.membersSection}>
          <Text style={styles.membersText}>Number of Members:</Text>
          <TouchableOpacity
            style={styles.adjustButton}
            onPress={() => setMembers(Math.max(1, members - 1))}
          >
            <Ionicons name="remove" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.membersNumber}>{members}</Text>
          <TouchableOpacity
            style={styles.adjustButton}
            onPress={() => setMembers(members + 1)}
          >
            <Ionicons name="add" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleBook}
        disabled={members <= 0}
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
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  vendorText: {
    fontSize: 16,
    marginVertical: 4,
  },
  timeFrameText: {
    fontSize: 16,
    marginVertical: 4,
  },
  durationText: {
    fontSize: 16,
    marginVertical: 4,
  },
  slotSection: {
    marginBottom: 20,
  },
  slotHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  slotText: {
    fontSize: 16,
  },
  membersSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  membersText: {
    fontSize: 16,
    marginRight: 10,
  },
  adjustButton: {
    backgroundColor: '#0B7784',
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  membersNumber: {
    fontSize: 16,
    marginHorizontal: 10,
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
