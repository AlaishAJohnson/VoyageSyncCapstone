import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import CustomButton from '../../constants/CustomButton';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hook/auth';

const TravelPreferences = () => {
  const router = useRouter();
  const { createUser, userData, updateUserData } = useAuth();
  const [foodPreferences, setFoodPreferences] = useState([]);
  const [weatherPreferences, setWeatherPreferences] = useState([]);
  const [activityPreferences, setActivityPreferences] = useState([]);

  // Fetch travel preferences from the 'Travel-Preference' collection when the user data is available
  useEffect(() => {
    const fetchTravelPreferences = async () => {
      if (userData && userData.travelPreferences) {
        try {
          const response = await fetch(`https://1379-24-163-58-200.ngrok-free.app/api/travel-preferences/${userData.travelPreferences.$oid}`);
          const travelPrefs = await response.json();
          if (travelPrefs) {
            // Set the preferences in state
            setFoodPreferences(travelPrefs.food || []);
            setWeatherPreferences(travelPrefs.weather || []);
            setActivityPreferences(travelPrefs.activities || []);
          }
        } catch (error) {
          console.error('Error fetching travel preferences:', error);
        }
      }
    };

    if (userData && userData.travelPreferences) {
      fetchTravelPreferences();
    }
  }, [userData]); // This will only run when userData changes

  // Ensure the updateUserData function is only called if preferences have changed
  useEffect(() => {
    if (
      foodPreferences.length !== (userData?.foodPreferences || []).length ||
      weatherPreferences.length !== (userData?.weatherPreferences || []).length ||
      activityPreferences.length !== (userData?.activityPreferences || []).length
    ) {
      updateUserData({
        foodPreferences,
        weatherPreferences,
        activityPreferences,
      });
    }
  }, [foodPreferences, weatherPreferences, activityPreferences, userData, updateUserData]);

  const toggleSelection = (category, item) => {
    if (category === 'food') {
      setFoodPreferences((prevState) => {
        const isSelected = prevState.includes(item);
        return isSelected
          ? prevState.filter((i) => i !== item)
          : [...prevState, item];
      });
    } else if (category === 'weather') {
      setWeatherPreferences((prevState) => {
        const isSelected = prevState.includes(item);
        return isSelected
          ? prevState.filter((i) => i !== item)
          : [...prevState, item];
      });
    } else if (category === 'activities') {
      setActivityPreferences((prevState) => {
        const isSelected = prevState.includes(item);
        return isSelected
          ? prevState.filter((i) => i !== item)
          : [...prevState, item];
      });
    }
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
                  (category === 'food' && foodPreferences.includes(item)) ||
                  (category === 'weather' && weatherPreferences.includes(item)) ||
                  (category === 'activities' && activityPreferences.includes(item))
                    ? styles.selectedItem
                    : {}
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
                  (category === 'food' && foodPreferences.includes(item)) ||
                  (category === 'weather' && weatherPreferences.includes(item)) ||
                  (category === 'activities' && activityPreferences.includes(item))
                    ? styles.selectedItem
                    : {}
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

  const handleSavePreferences = async () => {
    const updatedUserData = {
      ...userData,
      foodPreferences,
      weatherPreferences,
      activityPreferences,
    };

    try {
      await createUser(updatedUserData);
      const response = await fetch('https://1daa-68-234-200-22.ngrok-free.app/api/users/create', {
        method: 'POST',  
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUserData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to save preferences');
      }
      router.push('/userTabs');
    } catch (error) {
      console.error('Error creating user:', error);
      Alert.alert('Error', 'Failed to create user. Please try again.');
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

      <CustomButton title="Create Account" onPress={handleSavePreferences} />
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
    marginBottom: 0,
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
