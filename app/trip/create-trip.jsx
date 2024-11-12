import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import Slider from '@react-native-community/slider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';


const mockFriendData = [
  { id: '1', username: 'johndoe', phoneNumber: '123-456-7890', email: 'johndoe@example.com' },
  { id: '2', username: 'janedoe', phoneNumber: '098-765-4321', email: 'janedoe@example.com' },
  { id: '3', username: 'sam_smith', phoneNumber: '555-555-5555', email: 'samsmith@example.com' },
  { id: '4', username: 'alex.jones', phoneNumber: '444-444-4444', email: 'alexjones@example.com' },
  { id: '5', username: 'emily123', phoneNumber: '333-333-3333', email: 'emily@example.com' },
];

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
  const navigation = useNavigation();


  const handleFinishTrip = () => {
    console.log({
      destination,
      startDate,
      endDate,
      budget,
      invitedFriends,
    });
    navigation.navigate('user-home');
  };

  const filteredFriends = mockFriendData.filter(
    friend =>
      friend.username.toLowerCase().includes(friendQuery.toLowerCase()) ||
      friend.phoneNumber.includes(friendQuery) ||
      friend.email.toLowerCase().includes(friendQuery.toLowerCase())
  );
  const handleToggleFriend = (friend) => {
    if (invitedFriends.some(f => f.id === friend.id)) {
      setInvitedFriends(invitedFriends.filter(f => f.id !== friend.id));
    } else {
      setInvitedFriends([...invitedFriends, friend]);
    }
  };

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
        onValueChange={setBudget}
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
