import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const mockTripDetailsFromDB = {
  tripName: 'Birthday Trip',
  destination: 'Bahamas',
  startDate: '2024-12-04T05:00:00.000Z',
  endDate: '2024-12-08T05:00:00.000Z',
  budget: 2000,
  tripStatus: 'UPCOMING',
  groupTripId: '67098a4660b3494e29f13103',
  itinerary: [
    {
      title: 'Snorkeling Adventure',
      location: 'Bahamas',
      startTime: '9:00 AM',
      endTime: '11:00 AM',
      estimatedPrice: '$100 USD',
    },
    {
      title: 'Beach Day',
      location: 'Nassau',
      startTime: '1:00 PM',
      endTime: '5:00 PM',
      estimatedPrice: '$50 USD',
    },
  ],
};

const mockGroupTripDetailsFromDB = {
  members: [
    {
      id: '67112a5bedf3d7f2f6d54597',
      name: 'Alice',
      profileImage: 'https://example.com/alice.jpg',
      isOrganizer: true,
    },
    {
      id: '670439efbbbf4097e881a0cf',
      name: 'Bob',
      profileImage: 'https://example.com/bob.jpg',
      isOrganizer: false,
    },
  ],
};

const TripDetails = () => {
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState(1);


  const onExitPress = () => {
    router.back();
  };
  const hours = Array.from({ length: 24 }, (_, i) => {
    const hour = (i + 9) % 24; // Starts at 9 AM
    return `${hour === 0 ? 12 : hour} ${hour < 12 ? 'AM' : 'PM'}`;
  });

  return (
    <ScrollView>
      <View style={styles.container}>
        <Image
          source={{ uri: 'https://tempo.cdn.tambourine.com/windsong/media/windsong-gallery-12-5fb43a016cb8b.jpg' }} // Set your background image here
          style={styles.topImage}
        />
        <View style={styles.overlay}>
          <TouchableOpacity onPress={onExitPress}>
            <Text style={styles.exitButton}>✖</Text>
          </TouchableOpacity>

          <View style={styles.tripDetails}>
            <Text style={styles.tripName}>{mockTripDetailsFromDB.tripName}</Text>

            <View style={styles.locationContainer}>
              <Ionicons name="location-outline" size={20} color="#FE9F67" />
              <Text style={styles.destination}>{mockTripDetailsFromDB.destination}</Text>
            </View>

            <View style={styles.calendarContainer}>
              <Ionicons name="calendar-outline" size={20} color="#FE9F67" />
              <Text style={styles.tripDate}>
                {new Date(mockTripDetailsFromDB.startDate).toDateString()} - {new Date(mockTripDetailsFromDB.endDate).toDateString()}
              </Text>
            </View>

            <View style={styles.statusContainer}>
              <View style={styles.statusItem}>
                <Ionicons name="cash-outline" size={20} color="#FE9F67" />
                <Text style={styles.statusText}>Budget: ${mockTripDetailsFromDB.budget}</Text>
              </View>
              <View style={styles.statusItem}>
                <Ionicons name="time-outline" size={20} color="#FE9F67" />
                <Text style={styles.statusText}>Status: {mockTripDetailsFromDB.tripStatus}</Text>
              </View>
            </View>

            <Text style={styles.membersHeader}>Members</Text>
            <View style={styles.membersLine} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {mockGroupTripDetailsFromDB.members.map((member) => (
                <View style={styles.memberContainer} key={member.id}>
                  {member.isOrganizer && <Ionicons name="star" size={16} color="gold" style={styles.starIcon} />}
                  <Image source={{ uri: member.profileImage }} style={styles.memberImage} />
                  <Text style={styles.memberName}>{member.name.split(' ')[0]}{member.name.split(' ')[1]}</Text>
                </View>
              ))}
            </ScrollView>

            <Text style={styles.membersHeader}>Itinerary</Text>
            <View style={styles.membersLine} />
            

            <View style={styles.tabsContainer}>
              {Array.from({ length: 5 }, (_, i) => (
                <TouchableOpacity
                  key={i}
                  style={[styles.tab, selectedDay === i + 1 && styles.activeTab]}
                  onPress={() => setSelectedDay(i + 1)}
                >
                  <Text style={[styles.tabText, selectedDay === i + 1 && styles.activeTabText]}>
                    Day {i + 1}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <ScrollView>
            <View style={styles.itineraryContainer}>
              {/* Example itinerary cards, replace with dynamic data */}
              {[...Array(3)].map((_, index) => (
                <View key={index} style={styles.itineraryCard}>
                  <Text style={styles.itineraryTitle}>Activity {index + 1} for Day {selectedDay}</Text>
                  <Text style={styles.itineraryLocation}>Location {index + 1}</Text>
                  <Text style={styles.itineraryTime}>Time: {hours[selectedDay - 1]} - {hours[selectedDay]}</Text>
                  <View style={styles.priceContainer}>
                    <Text style={styles.price}>$20.00</Text>
                  </View>
                </View>
              ))}
              {true && <Text style={styles.noActivitiesText}>No activities planned for this day.</Text>}
            </View>
            </ScrollView>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topImage: {
    width: "100%",
    height: 600, 
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
    padding: 16,
    marginTop: 60, 
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -100,
  },
  exitButton: {
    fontSize: 24,
    color: '#000',
    alignSelf: 'flex-end',
  },
  tripDetails: {
    marginBottom: 16,
  },
  tripName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  destination: {
    marginLeft: 4,
    fontSize: 16,
  },
  calendarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  tripDate: {
    marginLeft: 4,
    fontSize: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    marginLeft: 4,
    fontSize: 16,
  },
  membersHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  membersLine: {
    height: 2,
    backgroundColor: '#000',
    marginVertical: 8,
  },
  memberContainer: {
    alignItems: 'center',
    marginRight: 16,
    marginTop: 10
  },
  starIcon: {
    position: 'absolute',
    top: -8,
    right: -8,
  },
  memberImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  memberName: {
    marginTop: 4,
    fontSize: 14,
    textAlign: 'center',
  },
  calendarHoursContainer: {
    marginTop: 20,
    paddingHorizontal: 8,
  },
  calendarHour: {
    padding: 16,
    backgroundColor: '#f9c2a6', // Light peach
    borderRadius: 8,
    marginRight: 10,
  },
  hourText: {
    fontWeight: 'bold',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  tab: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#0b7784', // Dark teal
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
  itineraryContainer: {
    marginTop: 16,
  },
  itineraryCard: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  itineraryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0b7784'
  },
  itineraryLocation: {
    fontSize: 14,
    color: '#666',
  },
  itineraryTime: {
    fontSize: 14,
    color: '#666',
  },
  priceContainer: {
    marginTop: 4,
  },
  price: {
    fontWeight: 'bold',
    color: '#FE9F67',
  },
  noActivitiesText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
});

export default TripDetails;
