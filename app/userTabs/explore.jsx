import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // Import useRouter

// Sample service data (replace this with data from your database)
const servicesData = [
  {
    id: '1',
    title: 'City Tour',
    description: 'Explore the beautiful city with a local guide.',
    price: '$50',
    vendor: 'Tourist Company',
    rating: 4.5,
    image: { uri: 'https://example.com/image1.jpg' },
    industry: 'Tours',
  },
  {
    id: '2',
    title: 'Beach Getaway',
    description: 'Relax at the beach with all-inclusive packages.',
    price: '$200',
    vendor: 'Beach Resort',
    rating: 4.8,
    image: { uri: 'https://example.com/image2.jpg' },
    industry: 'Resorts',
  },
  {
    id: '3',
    title: 'Mountain Hiking',
    description: 'Experience thrilling hikes with breathtaking views.',
    price: '$75',
    vendor: 'Adventure Co.',
    rating: 4.7,
    image: { uri: 'https://example.com/image3.jpg' },
    industry: 'Adventures',
  },
  // Add more services as needed
];

const Explore = () => {
  const [services, setServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchAllServices(); // Fetch all services on component mount
  }, []);

  const fetchAllServices = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/services'); // Adjust the URL as needed
      const data = await response.json();
      setServices(data); // Update state with fetched services
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    // Implement search filtering logic here based on the query if needed
  };

  const renderService = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => router.push(`/serviceDetails/${item.serviceId}`)} // Navigate to service details
    >
      <Image source={{ uri: item.image }} style={styles.cardImage} /> {/* Adjust for your image source */}
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.serviceName}</Text>
        <Text style={styles.cardDescription}>{item.serviceDescription}</Text>
        <Text style={styles.cardPrice}>{item.price}</Text>
        <Text style={styles.cardVendor}>Vendor: {/* Get vendor name from the relevant service data */}</Text>
        <Text style={styles.cardRating}>Rating: {/* Add rating if available */}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name='search' color='black' size={20} />
        <TextInput 
          placeholder='Search Services' 
          placeholderTextColor="#333" 
          value={searchQuery}
          onChangeText={handleSearch}
          style={styles.searchText}
        />
      </View>
      <FlatList
        data={services}
        renderItem={renderService}
        keyExtractor={(item) => item.serviceId}
        style={styles.serviceList}
      />
    </SafeAreaView>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  searchContainer: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    height: 50,
  },
  searchText: {
    flex: 1,
    marginLeft: 10,
    color: '#333',
    fontSize: 16,
  },
  industryFilterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  industryButton: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  activeIndustry: {
    backgroundColor: '#e0e0e0',
  },
  industryButtonText: {
    fontSize: 16,
    color: '#333',
  },
  serviceList: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'column',
    backgroundColor: '#f6f6f6',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  cardImage: {
    width: '100%',
    height: 150,
  },
  cardContent: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  cardVendor: {
    fontSize: 14,
    color: '#333',
  },
  cardRating: {
    fontSize: 14,
    color: '#ffcc00',
  },
});

export default Explore;
