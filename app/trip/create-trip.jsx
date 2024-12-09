import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, FlatList, Image, Alert } from 'react-native';
import Slider from '@react-native-community/slider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UNSPLASH_API_URL = "https://api.unsplash.com/search/photos";
const UNSPLASH_ACCESS_KEY = "nGGbmYUCHw8EYoosDMwwCMm-HlKU5_4-j_kNOLQFWpc";

const CreateTrip = () => {
  const [destination, setDestination] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [budget, setBudget] = useState(0);
  const [friendQuery, setFriendQuery] = useState('');
  const [invitedFriends, setInvitedFriends] = useState([]);
  const [friendsData, setFriendsData] = useState([]);
  const [userData, setUserData] = useState(null);
  const router = useRouter();

  const fetchUserData = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Error', 'User ID not found');
        return;
      }
  
      const authHeader = 'Basic ' + btoa('admin:admin'); // Base64 encode 'admin:admin'
  
      const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
        }
      });
  
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert('Error', 'Unable to load user data');
    }
  };
  

  const fetchFriendUsernames = async (friendIds) => {
    try {
      const authHeader = 'Basic ' + btoa('admin:admin'); 
  
      const friendUsernames = [];
      for (let id of friendIds) {
        const response = await fetch(`http://localhost:8080/api/users/${id}/username`, {
          method: 'GET',
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/json',
          }
        });
  
        const data = await response.json(); // Assuming the response is JSON
        if (data.username) {
          friendUsernames.push({ id, username: data.username });
        }
      }
      setFriendsData(friendUsernames);
    } catch (error) {
      console.error('Error fetching friend usernames:', error);
    }
  };
  

  const handleFinishTrip = async () => {
    try {
      const organizerId = await AsyncStorage.getItem('userId');
      if (!organizerId) {
        Alert.alert('Error', 'User ID not found to set to OrganizerId');
        return;
      }
  

      const authHeader = 'Basic ' + btoa('admin:admin'); 
      const isGroupTrip = invitedFriends.length > 0;
      const budgetValue = parseFloat(budget);
      const memberIds = invitedFriends.map(friend => friend.id);
  
      const tripPayload = {
        organizerId,
        tripName: destination, 
        imageUrl,
        destination,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        budget: budgetValue, 
        isGroupTrip,
        itinerary: [],
        memberIds: isGroupTrip ? memberIds : [],
        tripStatus: 'PROGRESS',
      };
      
      console.log("Payload being sent to backend: ", tripPayload);
      
      const response = await fetch(`http://localhost:8080/api/trips/create-trip/${organizerId}`, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tripPayload), 
      });
      
      
  
      
  
      if (response.ok) {
        const createdTrip = await response.json();
        Alert.alert('Success', 'Trip created successfully!');
        router.push("/userTabs/user-home");
      } else {
        const error = await response.json();
        Alert.alert('Error', error.message || 'Failed to create trip');
      }
    } catch (error) {
      console.error('Error creating trip:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };
  
  

  const filteredFriends = friendsData.filter(
    friend =>
      friend.username.toLowerCase().includes(friendQuery.toLowerCase())
  );

  const handleToggleFriend = (friend) => {
    if (invitedFriends.some(f => f.id === friend.id)) {
      setInvitedFriends(invitedFriends.filter(f => f.id !== friend.id));
    } else {
      setInvitedFriends([...invitedFriends, friend]);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (userData?.friendIds?.length > 0) {
      console.log('User friend IDs:', userData.friendIds);
      fetchFriendUsernames(userData.friendIds);  
    } else {
      console.log('No friends data available.');
    }
  }, [userData?.friendIds]);
  

  useEffect(() => {
    if (destination) {
      const fetchImage = async () => {
        try {
          const response = await axios.get(UNSPLASH_API_URL, {
            params: { query: destination, per_page: 1 },
            headers: {
              Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
            },
          });
          const image = response.data.results[0]?.urls?.small || '';
          setImageUrl(image);
        } catch (error) {
          console.error("Error fetching image:", error);
        }
      };
      fetchImage();
    }
  }, [destination]);


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create New Trip</Text>

      {/* Destination Search */}
      <TextInput
        style={styles.input}
        placeholder="Search destination"
        value={destination}
        onChangeText={setDestination}
        placeholderTextColor="black"
      />
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.destinationImage} />
      ) : (
        <Text style={styles.imagePlaceholder}></Text>
      )}

      {/* Date Selection */}
      <View style={styles.dateContainer}>
        <View>
          <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
            <Text style={styles.dateText}>Start Date: {startDate.toDateString()}</Text>
          </TouchableOpacity>
          {showStartDatePicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              onChange={(event, selectedDate) => {
                setShowStartDatePicker(false);
                if (selectedDate) setStartDate(selectedDate);
              }}
            />
          )}
        </View>
        <View>
          <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
            <Text style={styles.dateText}>End Date: {endDate.toDateString()}</Text>
          </TouchableOpacity>
          {showEndDatePicker && (
            <DateTimePicker
              value={endDate}
              mode="date"
              onChange={(event, selectedDate) => {
                setShowEndDatePicker(false);
                if (selectedDate) setEndDate(selectedDate);
              }}
            />
          )}
        </View>
      </View>

      {/* Budget Slider */}
      <Text style={styles.budgetLabel}>Budget: ${budget}</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={5000}
        step={100}
        value={budget}
        onValueChange={value => setBudget(parseFloat(value))} 
        minimumTrackTintColor="#0B7784"
        maximumTrackTintColor="#ccc"
        thumbTintColor="#0B7784"
      />


      {/* Friend Selection */}
      <TextInput
        style={styles.input}
        placeholder="Search friends by username, phone, or email"
        value={friendQuery}
        onChangeText={setFriendQuery}
        placeholderTextColor="black"
      />
      <FlatList
        data={filteredFriends}
        renderItem={({ item }) => {
          const isSelected = invitedFriends.some(f => f.id === item.id);
          return (
            <TouchableOpacity
              style={styles.friendItem}
              onPress={() => handleToggleFriend(item)}
            >
              <Text style={styles.friendText}>{item.username}</Text>
              <Ionicons 
                name={isSelected ? "checkmark-circle" : "add-circle-outline"} 
                size={20} 
                color="#0B7784" 
              />
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item) => item.id.toString()}
      />

      {/* Finish Button */}
      <TouchableOpacity style={styles.finishButton} onPress={handleFinishTrip}>
        <Text style={styles.finishButtonText}>Finish</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#0B7784',
    borderRadius: 10,
    padding: 10,
    marginVertical: 8,
  },
  destinationImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  dateContainer: {
    marginVertical: 10,
  },
  dateText: {
    fontSize: 16,
    color: '#0B7784',
    marginVertical: 5,
  },
  budgetLabel: {
    fontSize: 16,
    marginTop: 15,
    color: '#0B7784',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  friendText: {
    fontSize: 16,
  },
  finishButton: {
    width: '100%',
    height: 60,
    backgroundColor: '#0B7784',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginTop: 15,
  },
  finishButtonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  imagePlaceholder: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
    marginVertical: 10,
  },
});

export default CreateTrip;
