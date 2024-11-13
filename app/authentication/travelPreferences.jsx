import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import CustomButton from '../../constants/CustomButton';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hook/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TravelPreferences = () => {
  const router = useRouter();
  const { createUser, userData, updateUserData } = useAuth();
  const [foodPreferences, setFoodPreferences] = useState([]);
  const [weatherPreferences, setWeatherPreferences] = useState([]);
  const [activityPreferences, setActivityPreferences] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTravelPreferences = async () => {
      if (userData && userData.travelPreferences) {
        try {
          setLoading(true);
          const response = await fetch(`https://1daa-68-234-200-22.ngrok-free.app/api/travel-preferences/${userData.travelPreferences.$oid}`);
          const travelPrefs = await response.json();
          if (travelPrefs) {
            setFoodPreferences(travelPrefs.food || []);
            setWeatherPreferences(travelPrefs.weather || []);
            setActivityPreferences(travelPrefs.activities || []);
          }
        } catch (error) {
          console.error('Error fetching travel preferences:', error);
        } finally {
          setLoading(false); 
        }
      }
    };

    if (userData && userData.travelPreferences) {
      fetchTravelPreferences();
    }
  }, [userData]);

  const toggleSelection = (category, item) => {
    const updatePreferences = (category, item) => {
      switch (category) {
        case 'food':
          setFoodPreferences(prevState => toggleItem(prevState, item));
          break;
        case 'weather':
          setWeatherPreferences(prevState => toggleItem(prevState, item));
          break;
        case 'activities':
          setActivityPreferences(prevState => toggleItem(prevState, item));
          break;
        default:
          break;
      }
    };

    const toggleItem = (prevState, item) => {
      const isSelected = prevState.includes(item);
      return isSelected ? prevState.filter(i => i !== item) : [...prevState, item];
    };

    updatePreferences(category, item);
  };

  const renderBrickPatternSuggestions = (category, items) => {
    const firstRow = items.filter((_, index) => index % 2 === 0);
    const secondRow = items.filter((_, index) => index % 2 !== 0);

    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.brickContainer}>
          {/* First Row */}
          <View style={styles.suggestionsRow}>
            {firstRow.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.suggestionItem,
                  isSelected(category, item) && styles.selectedItem
                ]}
                onPress={() => toggleSelection(category, item)}
              >
                <Text style={styles.suggestionText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Second Row */}
          <View style={[styles.suggestionsRow, styles.offsetRow]}>
            {secondRow.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.suggestionItem,
                  isSelected(category, item) && styles.selectedItem
                ]}
                onPress={() => toggleSelection(category, item)}
              >
                <Text style={styles.suggestionText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    );
  };

  const isSelected = (category, item) => {
    return (
      (category === 'food' && foodPreferences.includes(item)) ||
      (category === 'weather' && weatherPreferences.includes(item)) ||
      (category === 'activities' && activityPreferences.includes(item))
    );
  };

  const handleSavePreferences = async () => {
    const userId = await AsyncStorage.getItem('userId');
    console.log("Retrieved userId:", userId);
  
    const travelPreferences = {
      food: foodPreferences,
      weather: weatherPreferences,
      activities: activityPreferences,
    };
  
    try {
      setLoading(true); // Show loading indicator while saving preferences
      const response = await fetch('https://1daa-68-234-200-22.ngrok-free.app/api/travel-preferences/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa('user:2054e07b-c906-4c41-8444-011e2cb7448f'),
        },
        body: JSON.stringify(travelPreferences),
      });
  
      // Check if the response is OK (status code 200-299)
      if (!response.ok) {
        throw new Error(`Failed to save preferences. Status: ${response.status}`);
      }
  
      const preferencesData = await response.json(); 
      console.log("Parsed Preferences Data:", preferencesData);
  
     
      const preferenceId = preferencesData.preferenceId;
  
      const linkResponse = await fetch(`https://1daa-68-234-200-22.ngrok-free.app/api/users/${userId}/linkPreferences/${preferenceId}`, {
        method: 'PUT',
        headers: {
          'Authorization': 'Basic ' + btoa('user:2054e07b-c906-4c41-8444-011e2cb7448f'),
        },
      });
  
      if (!linkResponse.ok) {
        const errorData = await linkResponse.json();
        throw new Error(`Failed to link preferences to user: ${errorData.message || 'Unknown error'}`);
      }

      const updatedUser = {
        ...userData,
        travelPreferences: preferencesData,
      };
  
      updateUserData(updatedUser);
  
      
      setTimeout(() => {
        router.push('/userTabs');
      }, 500);  
  
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to save or link preferences. Please try again.');
    } finally {
      setLoading(false); 
    }
  };
  
  
  

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Food</Text>
      {renderBrickPatternSuggestions('food', ['Mexican', 'Italian', 'Japanese', 'Indian', 'Thai', 'Greek', 'French', 'Me'])}

      <Text style={styles.header}>Weather</Text>
      {renderBrickPatternSuggestions('weather', ['Sunny', 'Rainy', 'Snowy', 'Tropical', 'Mild', 'Dry'])}

      <Text style={styles.header}>Activities</Text>
      {renderBrickPatternSuggestions('activities', ['Hiking', 'Beach', 'Skiing', 'City Tours', 'Museums', 'Shopping'])}

      <CustomButton title="Save Preferences" onPress={handleSavePreferences} />

      {loading && <ActivityIndicator size="large" color="#0B7784" />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    marginTop: 50,
  },
  header: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#0B7784',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  brickContainer: {
    flexDirection: 'column',
    marginBottom: 15,
  },
  suggestionsRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  offsetRow: {
    marginLeft: 25,
  },
  suggestionItem: {
    backgroundColor: 'rgba(11, 119, 132, 0.5)',
    paddingVertical: 28,
    paddingHorizontal: 35,
    borderRadius: 10,
    marginRight: 10,
  },
  selectedItem: {
    backgroundColor: '#0B7784',
  },
  suggestionText: {
    color: '#fff',
  },
});

export default TravelPreferences;
