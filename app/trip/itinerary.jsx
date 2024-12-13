import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Alert, Modal, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';

const TripItinerary = () => {
  const [selectedTab, setSelectedTab] = useState('Proposed');
  const [itineraryDetails, setItineraryDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [organizerId, setOrganizerId] = useState(null);
  const [votingStarted, setVotingStarted] = useState(false);
  const [votingEnded, setVotingEnded] = useState(false);

  const { tripId, userId } = useLocalSearchParams();

  const fetchOrganizerId = async (tripId) => {
    if (!tripId) return null;
    try {
      const response = await fetch(`http://localhost:8080/api/trips/${tripId}`, {
        method: 'GET',
        headers: { Authorization: 'Basic ' + btoa('admin:admin') },
      });
      const tripData = await response.json();
      return tripData.trips?.[0]?.organizerId;
    } catch {
      Alert.alert('Error', 'Failed to fetch trip organizer');
      return null;
    }
  };

  const fetchItineraryItems = async (tripId, userId, organizerId) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/itinerary/trip-itinerary/${tripId}`, {
        method: 'GET',
        headers: { Authorization: 'Basic ' + btoa('admin:admin') },
      });
      const data = await response.json();
      const categorizedItems = { Proposed: [], Suggested: [], Vote: [] };
      data.forEach((item) => {
        if (item.votes?.length > 0) categorizedItems.Vote.push(item);
        else if (item.creatorId === organizerId) categorizedItems.Proposed.push(item);
        else categorizedItems.Suggested.push(item);
      });
      setItineraryDetails(categorizedItems);
      if (!categorizedItems.Vote.length) setVotingEnded(true);
    } catch {
      Alert.alert('Error', 'Failed to fetch itinerary items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const organizer = await fetchOrganizerId(tripId);
      setOrganizerId(organizer);
      if (organizer) fetchItineraryItems(tripId, userId, organizer);
    };
    fetchData();
  }, [tripId, userId]);

  const handleVote = async (itineraryId, vote) => {
    console.log("HandleVote triggered.");
    try {
      const authHeader = 'Basic ' + btoa('admin:admin'); 
      const response = await fetch(
        `http://localhost:8080/api/itinerary/${itineraryId}/vote?userId=${userId}&vote=${vote}`,
        { method: 'POST', headers: { 
          'Authorization': authHeader,
          'Content-Type': 'application/json' 
        } }
      );
      const result = await response.json();
      console.log("Result: ", result);
      if (response.ok) {
        Alert.alert('Vote Recorded', result.message);
        fetchItineraryItems(tripId, userId, organizerId);
      } else {
        Alert.alert('Error', result.message || 'Failed to record vote.');
      }
    } catch {
      Alert.alert('Error', 'An unexpected error occurred while voting.');
    }
  };

  const renderTabContent = () => {
    if (loading) return <ActivityIndicator size="large" color="#0b7784" />;
    if (!itineraryDetails) return <Text style={styles.noItineraryText}>No itinerary details available.</Text>;

    const items = itineraryDetails[selectedTab] || [];
    return items.length > 0 ? (
      items.map((activity, index) => (
        <View key={index} style={styles.itineraryCard}>
          <Text style={styles.itineraryTitle}>{activity.serviceName}</Text>
          <Text style={styles.itineraryLocation}>{activity.location}</Text>
          <Text style={styles.itineraryTime}>
            {activity.dateOfService ? activity.dateOfService : 'No date available'}
          </Text>
          <Text style={styles.price}>${activity.price || 'N/A'}</Text>
          {selectedTab === 'Vote' && (
            <View style={styles.voteButtons}>
              <TouchableOpacity style={styles.voteButtonYes} onPress={() => handleVote(activity.itineraryId, true)}>
                <Text style={styles.voteButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.voteButtonNo} onPress={() => handleVote(activity.itineraryId, false)}>
                <Text style={styles.voteButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ))
    ) : (
      <Text style={styles.noItineraryText}>No {selectedTab} items available.</Text>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        {['Proposed', 'Suggested', 'Vote'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, selectedTab === tab && styles.activeTab]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text style={[styles.tabText, selectedTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.contentContainer}>{renderTabContent()}</View>
      {votingEnded && <Text style={styles.noItineraryText}>Voting has ended.</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  tabsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 },
  tab: { padding: 10 },
  activeTab: { borderBottomWidth: 2, borderBottomColor: '#0b7784' },
  tabText: { fontSize: 16 },
  activeTabText: { fontWeight: 'bold', color: '#0b7784' },
  contentContainer: { flex: 1, padding: 20 },
  itineraryCard: { marginBottom: 20, padding: 15, borderWidth: 1, borderColor: '#ccc', borderRadius: 5 },
  itineraryTitle: { fontSize: 18, fontWeight: 'bold' },
  itineraryLocation: { fontSize: 16, color: '#666' },
  itineraryTime: { fontSize: 14, color: '#999' },
  price: { fontSize: 16, fontWeight: 'bold', marginTop: 10 },
  voteButtons: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 },
  voteButtonYes: { backgroundColor: '#0b7784', padding: 10, borderRadius: 5 },
  voteButtonNo: { backgroundColor: '#f00', padding: 10, borderRadius: 5 },
  voteButtonText: { color: '#fff', fontWeight: 'bold' },
  noItineraryText: { textAlign: 'center', marginTop: 20, fontSize: 16, color: '#666' },
});

export default TripItinerary;
