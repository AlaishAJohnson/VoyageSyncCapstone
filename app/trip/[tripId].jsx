import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router'; 

const TripDetails = () => {
  const [tripDetails, setTripDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(1);
  const [membersData, setMembersData] = useState([]);


  const router = useRouter();
  const { tripId, userId } = useLocalSearchParams();


  useEffect(() => {
    console.log("useEffect for fetching details triggered.");
    if (tripId) {
      console.log('Fetching details for tripId:', tripId);
      fetchTripDetails(tripId);
    } else {
      console.error('No tripId in route params');
    }
  }, [tripId]);

  useEffect(() => {
    if (tripDetails?.memberIds?.length > 0) {
      fetchMemberDetails();
    }
  }, [tripDetails?.memberIds]);


  const fetchTripDetails = async (tripId) => {
    setLoading(true);
    try {
      const authHeader = 'Basic ' + btoa('admin:admin'); 
      const response = await fetch(`http://localhost:8080/api/trips/${tripId}`, {
        headers: {
          'Authorization': authHeader,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch trip details');
      }
  
      const data = await response.json();
      setTripDetails(data.trips[0]);  
    } catch (error) {
      console.error('Error fetching trip details:', error);
    } finally {
      setLoading(false);
    }
  
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>Loading trip details...</Text>
      </View>
    );
  }

  if (!tripDetails) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Error loading trip details. Please try again.</Text>
      </View>
    );
  }
  
  const fetchMemberDetails = async () => {
    try {
      const authHeader = 'Basic ' + btoa('admin:admin'); 
      const response = await fetch(`http://localhost:8080/api/users/usernames?userIds=${tripDetails.memberIds.join(',')}`, {
        method: 'GET',
        headers: {
          'Authorization': authHeader,
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      setMembersData(data); 
    } catch (error) {
      console.error('Error fetching member details:', error);
    }
  };
  

  const onExitPress = () => {
    router.back('/userTabs');
  };
  
  const hours = Array.from({ length: 24 }, (_, i) => {
    const hour = (i + 9) % 24; 
    return `${hour === 0 ? 12 : hour} ${hour < 12 ? 'AM' : 'PM'}`;
  });
  
  return (
    <ScrollView>
      <View style={styles.container}>
        <Image
          source={{ uri: tripDetails.imageUrl }} 
          style={styles.topImage}
        />
        <View style={styles.overlay}>
          <View style={styles.tripDetails}>
            <Text style={styles.tripName}>{tripDetails.tripName}</Text>
  
            <View style={styles.locationContainer}>
              <Ionicons name="location-outline" size={20} color="#FE9F67" />
              <Text style={styles.destination}>{tripDetails.destination}</Text>
            </View>
  
            <View style={styles.calendarContainer}>
              <Ionicons name="calendar-outline" size={20} color="#FE9F67" />
              <Text style={styles.tripDate}>
                {new Date(tripDetails.startDate).toDateString()} - {new Date(tripDetails.endDate).toDateString()}
              </Text>
            </View>
  
            <View style={styles.statusContainer}>
              <View style={styles.statusItem}>
                <Ionicons name="cash-outline" size={20} color="#FE9F67" />
                <Text style={styles.statusText}>Budget: ${tripDetails.budget}</Text>
              </View>
              <View style={styles.statusItem}>
                <Ionicons name="time-outline" size={20} color="#FE9F67" />
                <Text style={styles.statusText}>Status: {tripDetails.tripStatus}</Text>
              </View>
            </View>
  
            <Text style={styles.membersHeader}>Members</Text>
            <View style={styles.membersLine} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {membersData.map((member, index) => (
                <View style={styles.memberContainer} key={member.userId}>
                  {member.userId === tripDetails?.organizerId && (
                    <Ionicons name="star" size={16} color="gold" style={styles.starIcon} />
                  )}
                  <Image
                    source={{
                      uri: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhuK2yF9SqI7kmpz-lEct85j_mNWw68SjkMQ&s`,
                    }}
                    style={styles.memberImage}
                  />
                  <Text style={styles.memberName}>{member.firstName}</Text> 
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity onPress={() => router.push(`/trip/itinerary?tripId=${tripId}&userId=${userId}`)}>
              <Text style={styles.membersHeader}>Itinerary</Text>
            </TouchableOpacity>
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
            <View style={styles.itineraryContainer}>
              {tripDetails.itinerary?.length > 0 ? (
                tripDetails.itinerary.map((activity, index) => (
                  <View key={index} style={styles.itineraryCard}>
                    <Text style={styles.itineraryTitle}>{activity.title}</Text>
                    <Text style={styles.itineraryLocation}>{activity.location}</Text>
                    <Text style={styles.itineraryTime}>
                      {hours[selectedDay - 1]} - {hours[selectedDay]}
                    </Text>
                    <View style={styles.priceContainer}>
                      <Text style={styles.price}>${activity.estimatedPrice}</Text>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.noItineraryText}>No itinerary items available.</Text>
              )}
            </View>

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
    height: 385,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 16,
    marginTop: 10,
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
    color: '#0b7784'
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  destination: {
    marginLeft: 4,
    fontSize: 18,
  },
  calendarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  tripDate: {
    marginLeft: 4,
    fontSize: 18,
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
    fontSize: 18,
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
  tabsContainer: {
    flexDirection: 'row',
    marginTop: 20,
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
  noItineraryText: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default TripDetails;
// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, TouchableOpacity, Modal, TextInput, Button } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useRouter, useLocalSearchParams } from 'expo-router'; 

// const TripDetails = () => {
//   const [tripDetails, setTripDetails] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [selectedDay, setSelectedDay] = useState(1);
//   const [membersData, setMembersData] = useState([]);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const [feedback, setFeedback] = useState('');



//   const router = useRouter();
//   const { tripId, userId } = useLocalSearchParams();
  
//   const handleFeedbackChange = (text) => {
//     setFeedback(text);
//   };

//   const submitFeedback = async () => {
//     if (!feedback) {
//       alert('Please enter feedback before submitting.');
//       return;
//     }

//     try {
//       const authHeader = 'Basic ' + btoa('admin:admin');
//       const url = 'http://localhost:8080/api/feedback';
//       const feebackData = {

//       }
//       const response = await fetch(url, {
//         method: 'POST',
//         headers: {
//           'Authorization': authHeader,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           // bookingId: selectedBooking.bookingId,
//           feedback: feedback,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to submit feedback`);
//       }

//       alert('Feedback submitted successfully!');
//       setIsModalVisible(false);
//       setFeedback('');
//     } catch (error) {
//       console.error('Error submitting feedback:', error);
//       alert('Failed to submit feedback. Please try again.');
//     }
//   };


//   useEffect(() => {
//     console.log('Trip ID:', tripId);
//     console.log('User ID:', userId);
//     if (tripId) {
//       fetchTripDetails(tripId);
//     } else {
//       console.error('No tripId in route params');
//     }
//   }, [tripId]);
  

//   useEffect(() => {
//     if (tripDetails?.memberIds?.length > 0) {
//       fetchMemberDetails();
//     }
//   }, [tripDetails?.memberIds]);
//   useEffect(() => {
//     console.log('Members Data:', membersData);
//   }, [tripDetails, membersData]);
  


//   const fetchTripDetails = async (tripId) => {
//     setLoading(true);
//     try {
//       const authHeader = 'Basic ' + btoa('admin:admin'); 
//       const response = await fetch(`http://localhost:8080/api/trips/${tripId}`, {
//         headers: {
//           'Authorization': authHeader,
//         },
//       });
//       console.log('Response status:', response.status);
  
//       if (!response.ok) {
//         throw new Error(`Failed to fetch trip details. Status: ${response.status}`);
//       }
  
//       const data = await response.json();
//       console.log('Fetched Trip Details:', data);
//       setTripDetails(data.trips[0]);
//     } catch (error) {
//       console.error('Error fetching trip details:', error);
//     } finally {
//       setLoading(false);
//     }
//   };
  
  

//   if (loading) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" />
//         <Text>Loading trip details...</Text>
//       </View>
//     );
//   }

//   if (!tripDetails) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <Text>Error loading trip details. Please try again.</Text>
//       </View>
//     );
//   }
  
//   const fetchMemberDetails = async () => {
//     try {
//       const authHeader = 'Basic ' + btoa('admin:admin'); 
//       const response = await fetch(`http://localhost:8080/api/users/usernames?userIds=${tripDetails.memberIds.join(',')}`, {
//         method: 'GET',
//         headers: {
//           'Authorization': authHeader,
//         },
//       });
  
//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }
  
//       const data = await response.json();
//       setMembersData(data); 
//     } catch (error) {
//       console.error('Error fetching member details:', error);
//     }
//   };
  
//   const fetchItineraryItems = async () => {
//     setLoading(true);
  
//     if (!userId || !tripId) {
//       console.error('Missing userId or tripId, cannot fetch itinerary items');
//       setLoading(false);
//       return;
//     }
  
//     try {
//       const authHeader = 'Basic ' + btoa('admin:admin');
//       const response = await fetch(`http://localhost:8080/api/itinerary/${tripId}`, {
//         method: 'GET',
//         headers: {
//           'Authorization': authHeader,
//         },
//       });
  
//       if (!response.ok) {
//         throw new Error('Failed to fetch itinerary items');
//       }
  
//       const data = await response.json(); 
//       const categorizedItems = {
//         Proposed: [],
//         Suggested: [],
//         Vote: [],
//       };
//       console.log("Fetched Itinerary Items: ", data);

  
//     } catch (error) {
//       console.error('Error fetching itinerary items:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const onExitPress = () => {
//     router.back('/userTabs');
//   };
  
//   const hours = Array.from({ length: 24 }, (_, i) => {
//     const hour = (i + 9) % 24; 
//     return `${hour === 0 ? 12 : hour} ${hour < 12 ? 'AM' : 'PM'}`;
//   });
  
//   return (
//     <ScrollView>
//       <View style={styles.container}>
//         <Image
//           source={{ uri: tripDetails.imageUrl }} 
//           style={styles.topImage}
//         />
//         <View style={styles.overlay}>
//           <View style={styles.tripDetails}>
//             <Text style={styles.tripName}>{tripDetails.tripName}</Text>
  
//             <View style={styles.locationContainer}>
//               <Ionicons name="location-outline" size={20} color="#FE9F67" />
//               <Text style={styles.destination}>{tripDetails.destination}</Text>
//             </View>
  
//             <View style={styles.calendarContainer}>
//               <Ionicons name="calendar-outline" size={20} color="#FE9F67" />
//               <Text style={styles.tripDate}>
//                 {new Date(tripDetails.startDate).toDateString()} - {new Date(tripDetails.endDate).toDateString()}
//               </Text>
//             </View>
  
//             <View style={styles.statusContainer}>
//               <View style={styles.statusItem}>
//                 <Ionicons name="cash-outline" size={20} color="#FE9F67" />
//                 <Text style={styles.statusText}>Budget: ${tripDetails.budget}</Text>
//               </View>
//               <View style={styles.statusItem}>
//                 <Ionicons name="time-outline" size={20} color="#FE9F67" />
//                 <Text style={styles.statusText}>Status: {tripDetails.tripStatus}</Text>
//               </View>
//             </View>
  
//             <Text style={styles.membersHeader}>Members</Text>
//             <View style={styles.membersLine} />
//             <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//               {membersData.map((member, index) => (
//                 <View style={styles.memberContainer} key={member.userId}>
//                   {member.userId === tripDetails?.organizerId && (
//                     <Ionicons name="star" size={16} color="gold" style={styles.starIcon} />
//                   )}
//                   <Image
//                     source={{
//                       uri: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhuK2yF9SqI7kmpz-lEct85j_mNWw68SjkMQ&s`,
//                     }}
//                     style={styles.memberImage}
//                   />
//                   <Text style={styles.memberName}>{member.firstName}</Text> 
//                 </View>
//               ))}
//             </ScrollView>

//             <TouchableOpacity onPress={() => router.push(`/trip/itinerary?tripId=${tripId}&userId=${userId}`)}>
//               <Text style={styles.membersHeader}>Itinerary</Text>
//             </TouchableOpacity>
//             <View style={styles.membersLine} />
//             <View style={styles.tabsContainer}>
//               {Array.from({ length: 5 }, (_, i) => (
//                 <TouchableOpacity
//                   key={i}
//                   style={[styles.tab, selectedDay === i + 1 && styles.activeTab]}
//                   onPress={() => setSelectedDay(i + 1)}
//                 >
//                   <Text style={[styles.tabText, selectedDay === i + 1 && styles.activeTabText]}>
//                     Day {i + 1}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//             <View style={styles.itineraryContainer}>
//                 {tripDetails.itinerary?.length > 0 ? (
//                     tripDetails.itinerary.map((activity, index) => (
//                         <TouchableOpacity 
//                           key={index} 
//                           style={styles.itineraryCard}
//                           onPress={() => {
//                             console.log('Itinerary Item:', activity); 
//                             setIsModalVisible(true);
//                           }}
//                         >
//                           <Text style={styles.itineraryTitle}>{activity.title}</Text>
//                           <Text style={styles.itineraryLocation}>{activity.location}</Text>
//                           <Text style={styles.itineraryTime}>
//                             {hours[selectedDay - 1]} - {hours[selectedDay]}
//                           </Text>
//                           <View style={styles.priceContainer}>
//                             <Text style={styles.price}>${activity.estimatedPrice}</Text>
//                           </View>
//                         </TouchableOpacity>
//                     ))
//                 ) : (
//                     <Text style={styles.noItineraryText}>No itinerary items available.</Text>
//                 )}
//               </View>
//           </View>
//         </View>
//       </View>
//       {/* Feedback Modal */}
//       <Modal visible={isModalVisible} animationType="slide" transparent={true}>
//           <View style={styles.modalContainer}>
//             <View style={styles.modalContent}>
//               <Text style={styles.modalTitle}>Leave Feedback</Text>
//               <TextInput
//                   style={styles.input}
//                   placeholder="Write your feedback here..."
//                   value={feedback}
//                   onChangeText={handleFeedbackChange}
//                   multiline
//               />
//               <Button title="Submit Feedback" onPress={submitFeedback} styles={styles.modalBtn} />
//               <Button title="Cancel" onPress={() => setIsModalVisible(false)} styles={styles.modalBtn} />
//             </View>
//           </View>
//         </Modal>
//     </ScrollView>
//   );
  
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   topImage: {
//     width: "100%",
//     height: 385,
//     resizeMode: 'cover',
//   },
//   overlay: {
//     flex: 1,
//     backgroundColor: 'rgba(255, 255, 255, 0.8)',
//     padding: 16,
//     marginTop: 10,
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     marginTop: -100,
//   },
//   exitButton: {
//     fontSize: 24,
//     color: '#000',
//     alignSelf: 'flex-end',
//   },
//   tripDetails: {
//     marginBottom: 16,
//   },
//   tripName: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#0b7784'
//   },
//   locationContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   destination: {
//     marginLeft: 4,
//     fontSize: 18,
//   },
//   calendarContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 4,
//   },
//   tripDate: {
//     marginLeft: 4,
//     fontSize: 18,
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalContent: {
//     width: 300,
//     padding: 20,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   textFieldContainer: {
//     width: '100%',
//     marginBottom: 10,
//   },
//   input: {
//     margin: 5,
//     padding: 15,
//     height: 60,
//     textAlign: 'center',
//     backgroundColor: 'rgba(11, 119, 132, 0.5)', 
//     borderRadius: 20,
//     color: '#fff',
//   },
//   modalButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   modalBtn: {
//     backgroundColor: '#0B7784',
//     padding: 10,
//     borderRadius: 5,
//     flex: 1,
//     margin: 5,
//   },
//   modalBtnText: {
//     color: '#fff',
//     textAlign: 'center',
//   },
//   statusContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 16,
//   },
//   statusItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   statusText: {
//     marginLeft: 4,
//     fontSize: 18,
//   },
//   membersHeader: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginTop: 20,
//   },
//   membersLine: {
//     height: 2,
//     backgroundColor: '#000',
//     marginVertical: 8,
//   },
//   memberContainer: {
//     alignItems: 'center',
//     marginRight: 16,
//     marginTop: 10
//   },
//   starIcon: {
//     position: 'absolute',
//     top: -8,
//     right: -8,
//   },
//   memberImage: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//   },
//   memberName: {
//     marginTop: 4,
//     fontSize: 14,
//     textAlign: 'center',
//   },
//   tabsContainer: {
//     flexDirection: 'row',
//     marginTop: 20,
//   },
//   tab: {
//     padding: 12,
//     borderWidth: 1,
//     borderColor: '#0b7784',
//     borderRadius: 8,
//     marginRight: 10,
//   },
//   activeTab: {
//     backgroundColor: '#0b7784',
//   },
//   tabText: {
//     color: '#000',
//     fontWeight: 'bold',
//   },
//   activeTabText: {
//     color: '#fff',
//   },
//   itineraryContainer: {
//     marginTop: 16,
//   },
//   itineraryCard: {
//     padding: 16,
//     backgroundColor: '#ffffff',
//     borderRadius: 8,
//     marginBottom: 10,
//     shadowColor: '#000',
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   itineraryTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#0b7784'
//   },
//   itineraryLocation: {
//     fontSize: 14,
//     color: '#666',
//   },
//   itineraryTime: {
//     fontSize: 14,
//     color: '#666',
//   },
//   priceContainer: {
//     marginTop: 4,
//   },
//   price: {
//     fontWeight: 'bold',
//     color: '#FE9F67',
//   },
//   noItineraryText: {
//     fontSize: 16,
//     color: 'gray',
//     textAlign: 'center',
//     marginTop: 20,
//   },
// });

// export default TripDetails;