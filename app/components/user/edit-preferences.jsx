import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, ActivityIndicator, TextInput } from 'react-native';
import CustomButton from '../../../constants/CustomButton';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../hook/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const EditPreferences = () => {
  const router = useRouter();
  const { userData, updateUserData } = useAuth();
  const [foodPreferences, setFoodPreferences] = useState([
    'Pizza', 'Sushi', 'Tacos', 'Pasta', 'Burger', 'Salad'
  ]);
  const [weatherPreferences, setWeatherPreferences] = useState([
    'Sunny', 'Rainy', 'Windy', 'Snowy'
  ]);
  const [activityPreferences, setActivityPreferences] = useState([
    'Hiking', 'Swimming', 'Cycling', 'Reading', 'Jogging'
  ]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // State to track the section being edited
  const [editingSection, setEditingSection] = useState(null); // null means no section is being edited

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
      const response = await fetch('https://your-api-url/api/travel-preferences/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa('user:your-api-key'),
        },
        body: JSON.stringify(travelPreferences),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to save preferences. Status: ${response.status}`);
      }
  
      const preferencesData = await response.json(); 
      console.log("Parsed Preferences Data:", preferencesData);
  
      const preferenceId = preferencesData.preferenceId;
  
      const linkResponse = await fetch(`https://your-api-url/api/users/${userId}/linkPreferences/${preferenceId}`, {
        method: 'PUT',
        headers: {
          'Authorization': 'Basic ' + btoa('user:your-api-key'),
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

  const handleAddNewPreference = () => {
    if (searchQuery) {
      if (foodPreferences.includes(searchQuery) || weatherPreferences.includes(searchQuery) || activityPreferences.includes(searchQuery)) {
        Alert.alert('Preference already exists');
      } else {
        setFoodPreferences(prevState => [...prevState, searchQuery]);  // Add to appropriate category, e.g., food
        setSearchQuery('');
      }
    }
  };

  const handleEditClick = (category) => {
    setEditingSection(category); // Set the category as being edited
  };

  return (
    <ScrollView>
        <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.header, editingSection === 'food' && { color: '#FE9F67' }]}>Food</Text>
        <TouchableOpacity onPress={() => handleEditClick('food')}>
            <Ionicons name="pencil" size={20} color="#0B7784" style={styles.icon} />
        </TouchableOpacity>
      </View>
      {renderBrickPatternSuggestions('food', foodPreferences)}

      <View style={styles.sectionHeader}>
        <Text style={[styles.header, editingSection === 'weather' && { color: '#FE9F67' }]}>Weather</Text>
        <TouchableOpacity onPress={() => handleEditClick('weather')}>
            <Ionicons name="pencil" size={20} color="#0B7784" style={styles.icon} />
        </TouchableOpacity>
      </View>
      {renderBrickPatternSuggestions('weather', weatherPreferences)}

      <View style={styles.sectionHeader}>
        <Text style={[styles.header, editingSection === 'activities' && { color: '#FE9F67' }]}>Activities</Text>
        <TouchableOpacity onPress={() => handleEditClick('activities')}>
            <Ionicons name="pencil" size={20} color="#0B7784" style={styles.icon} />
        </TouchableOpacity>
      </View>
      {renderBrickPatternSuggestions('activities', activityPreferences)}

      <TextInput
        style={styles.searchBar}
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Add new preference"
      />
      <CustomButton title="Add Preference" onPress={handleAddNewPreference} />

      <CustomButton title="Save Preferences" onPress={handleSavePreferences} />

      {loading && <ActivityIndicator size="large" color="#0B7784" />}
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    marginTop: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  header: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#0B7784',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  editText: {
    color: '#0B7784',
    fontSize: 16,
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
  searchBar: {
    height: 40,
    borderColor: '#0B7784',
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 20,
    paddingLeft: 10,
  },
});

export default EditPreferences;
