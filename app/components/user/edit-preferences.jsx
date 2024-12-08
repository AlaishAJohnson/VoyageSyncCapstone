import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, ActivityIndicator, TextInput } from 'react-native';
import CustomButton from '../../../constants/CustomButton';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const EditPreferences = () => {
  const router = useRouter();
  const [foodPreferences, setFoodPreferences] = useState([]);
  const [weatherPreferences, setWeatherPreferences] = useState([]);
  const [activityPreferences, setActivityPreferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingSection, setEditingSection] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem('userData');
        if (storedUserData) {
          const parsedUserData = JSON.parse(storedUserData);
          setUserData(parsedUserData);
          
        } else {
          Alert.alert('Error', 'User data not found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        if (!userData) {
          Alert.alert("Error", "User data not available.");
          return;
        }
  
        console.log("User Data: ", userData);
        const preferenceId = userData?.travelPreferences?.preferenceId;
  
        if (!preferenceId) {
          throw new Error("Preference ID not found in user data");
        }
  
        const authHeader = 'Basic ' + btoa('admin:admin'); 
  
        const response = await fetch(`http://localhost:8080/api/travel-preferences/${preferenceId}`, {
          method: "GET",
          headers: {
            'Authorization': authHeader,
            "Content-Type": "application/json",
           
          },
        });
  
        if (!response.ok) {
          throw new Error(`Error fetching preferences: ${response.status}`);
        }
  
        const data = await response.json();
  
        setFoodPreferences(data.food || []);
        setWeatherPreferences(data.weather || []);
        setActivityPreferences(data.activities || []);
      } catch (error) {
        console.error("Failed to fetch preferences:", error);
        Alert.alert("Error", "Failed to load preferences. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
  
    if (userData) {
      fetchPreferences();
    }
  }, [userData]);

  const toggleSelection = (category, item) => {
    const toggleItem = (prevState, item) => {
      const isSelected = prevState.includes(item);
      return isSelected ? prevState.filter(i => i !== item) : [...prevState, item];
    };

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

  const handleSavePreferences = async () => {
    setLoading(true);
    try {
      const preferenceId = userData?.travelPreferences?.preferenceId;
      if (!preferenceId) {
        Alert.alert('Error', 'Preference ID not found.');
        return;
      }

      const updatedPreferences = {};
  
      if (foodPreferences.length > 0 && JSON.stringify(foodPreferences) !== JSON.stringify(userData?.travelPreferences?.food)) {
        updatedPreferences.food = foodPreferences; 
      }

      if (weatherPreferences.length > 0 && JSON.stringify(weatherPreferences) !== JSON.stringify(userData?.travelPreferences?.weather)) {
        updatedPreferences.weather = weatherPreferences; 
      }
  
      if (activityPreferences.length > 0 && JSON.stringify(activityPreferences) !== JSON.stringify(userData?.travelPreferences?.activities)) {
        updatedPreferences.activities = activityPreferences; 
      }
  
      if (Object.keys(updatedPreferences).length === 0) {
        Alert.alert('No Changes', 'No preferences were changed.');
        return;
      }
  
      const mergedPreferences = {
        ...userData?.travelPreferences,  
        ...updatedPreferences,  
      };
  
      console.log("Merged Preferences:", mergedPreferences); 
  
      const authHeader = 'Basic ' + btoa('admin:admin'); 
      
      const response = await fetch(`http://localhost:8080/api/users/preferences/${preferenceId}`, {
        method: 'PUT',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...mergedPreferences,  
        }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error saving preferences:", errorText);
        Alert.alert('Error', `Failed to save preferences: ${errorText}`);
      } else {
        const data = await response.json();
        Alert.alert('Success', 'Preferences saved successfully!');
        router.push('/userTabs/user-profile');
      }
    } catch (error) {
      console.error("Error saving preferences:", error);
      Alert.alert("Error", "Failed to save preferences. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const renderBrickPatternSuggestions = (category, items) => {
    if (!items || items.length === 0) {
      return <Text>No suggestions available</Text>;
    }
  
    const firstRow = items.filter((_, index) => index % 2 === 0);
    const secondRow = items.filter((_, index) => index % 2 !== 0);
  
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.brickContainer}>
          <View style={styles.suggestionsRow}>
            {firstRow.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.suggestionItem,
                  isSelected(category, item) && styles.selectedItem,
                ]}
                onPress={() => toggleSelection(category, item)}
              >
                <Text style={styles.suggestionText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={[styles.suggestionsRow, styles.offsetRow]}>
            {secondRow.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.suggestionItem,
                  isSelected(category, item) && styles.selectedItem,
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

  const handleAddNewPreference = () => {
    if (!searchQuery.trim()) {
      Alert.alert('Error', 'Please enter a valid preference.');
      return;
    }
  
    if (foodPreferences.includes(searchQuery) || weatherPreferences.includes(searchQuery) || activityPreferences.includes(searchQuery)) {
      Alert.alert('Preference already exists');
      return;
    }
  
    if (!activeCategory) {
      Alert.alert('Error', 'Please select a category before adding a preference.');
      return;
    }
  
    if (activeCategory === 'food') {
      setFoodPreferences(prevState => [...prevState, searchQuery]);
    } else if (activeCategory === 'weather') {
      setWeatherPreferences(prevState => [...prevState, searchQuery]);
    } else if (activeCategory === 'activities') {
      setActivityPreferences(prevState => [...prevState, searchQuery]);
    }
  
    setSearchQuery(''); 
  };
  

  const handleEditClick = (category) => {
    setEditingSection(prev => (prev === category ? null : category));
    setActiveCategory(prev => prev === category ? null : category); 
  };
  
  

  return loading ? (
    <ActivityIndicator size="large" color="#0B7784" style={{ flex: 1, justifyContent: 'center' }} />
  ) : (
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
        placeholderTextColor="black"
        />
        <CustomButton title="Add Preference" onPress={handleAddNewPreference} />
        <CustomButton title="Save Preferences" onPress={handleSavePreferences} />
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
