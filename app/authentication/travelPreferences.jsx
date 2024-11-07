import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import CustomButton from '../../constants/CustomButton';
import { useRouter, useNavigation } from 'expo-router'

const TravelPreferences = () => {
  const mainColor = '#0B7784';
  const router = useRouter()
  const [selectedPreferences, setSelectedPreferences] = useState({
    food: [],
    weather: [],
    activities: []
  });

  const toggleSelection = (category, item) => {
    setSelectedPreferences((prevState) => {
      const isSelected = prevState[category].includes(item);
      return {
        ...prevState,
        [category]: isSelected
          ? prevState[category].filter((i) => i !== item)
          : [...prevState[category], item]
      };
    });
  };

  const renderBrickPatternSuggestions = (category, items) => {
    // Split items into two rows for brick pattern
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
                  selectedPreferences[category].includes(item) && styles.selectedItem
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
                  selectedPreferences[category].includes(item) && styles.selectedItem
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

  const handleSubmit = () => {
    const { food, weather, activities } = selectedPreferences;

    if (food.length === 0) {
      Alert.alert('Incomplete Selection', 'Please select at least one food preference.');
      return;
    }
    if (weather.length === 0) {
      Alert.alert('Incomplete Selection', 'Please select at least one weather preference.');
      return;
    }
    if (activities.length === 0) {
      Alert.alert('Incomplete Selection', 'Please select at least one activity preference.');
      return;
    }

    router.push('/userTabs');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Food</Text>
      {renderBrickPatternSuggestions('food', ['Mexican', 'Italian', 'Japanese', 'Indian', 'Thai', 'Greek', 'French', 'Me'])}

      <Text style={styles.header}>Weather</Text>
      {renderBrickPatternSuggestions('weather', ['Sunny', 'Rainy', 'Snowy', 'Tropical', 'Mild', 'Dry'])}

      <Text style={styles.header}>Activities</Text>
      {renderBrickPatternSuggestions('activities', ['Hiking', 'Beach', 'Skiing', 'City Tours', 'Museums', 'Shopping'])}

      <CustomButton title='Create Account' onPress={handleSubmit}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    marginTop: 50
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
