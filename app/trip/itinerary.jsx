import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';

const TripItinerary = () => {
  const [selectedTab, setSelectedTab] = useState(null); 

  const proposedItems = []; 
  const suggestedItems = []; 
  const voteItems = [];
  const renderTabContent = () => {
    switch (selectedTab) {
      case 'Proposed':
        return proposedItems.length > 0 ? (
          proposedItems.map((item, index) => (
            <View key={index} style={styles.itemContainer}>
              <Text>{item.title}</Text>
              <Text>{item.location}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noItineraryText}>No Proposed items.</Text>
        );

      case 'Suggested':
        return suggestedItems.length > 0 ? (
          suggestedItems.map((item, index) => (
            <View key={index} style={styles.itemContainer}>
              <Text>{item.title}</Text>
              <Text>{item.location}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noItineraryText}>No Suggested items.</Text>
        );

      case 'Vote':
        return voteItems.length > 0 ? (
          voteItems.map((item, index) => (
            <View key={index} style={styles.itemContainer}>
              <Text>{item.title}</Text>
              <Text>{item.location}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noItineraryText}>No Vote items.</Text>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        {['Proposed', 'Suggested', 'Vote'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, selectedTab === tab && styles.activeTab]}
            onPress={() => setSelectedTab(selectedTab === tab ? null : tab)}
          >
            <Text style={[styles.tabText, selectedTab === tab && styles.activeTabText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <View style={styles.contentContainer}>{renderTabContent()}</View>
    </View>
  );
};

export default TripItinerary;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    margin: 10,
  },
  tab: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#0b7784',
    borderRadius: 8,
    marginRight: 10,
  },
  activeTab: {
    backgroundColor: '#0b7784',
  },
  tabText: {
    color: '#000',
    fontWeight: 'bold',
  },
  activeTabText: {
    color: '#fff',
  },
  contentContainer: {
    marginTop: 20,
  },
  itemContainer: {
    marginBottom: 10,
  },
  noItineraryText: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
    fontWeight: 'bold'
  },
});
