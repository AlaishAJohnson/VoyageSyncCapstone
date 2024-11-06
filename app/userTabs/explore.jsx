import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // Import useRouter



const Explore = () => {
  const [services, setServices] = useState([]);
  const [originalServices, setOriginalServices] = useState([]); 
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchAllServices(); 
  }, []);

  const fetchAllServices = async () => {
    try {
        const response = await fetch('https://7514-68-234-200-22.ngrok-free.app/api/services/vendor'); 
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched Services:", data); // Log entire fetched data
        
        // Ensure we set original services too
        setOriginalServices(data); // Store original services for filtering
        
        data.forEach(service => {
            // Make sure serviceName exists and is a string
            if (typeof service.serviceName === 'string') {
                console.log(`Service Name: ${service.serviceName}`);
            } else {
                console.error('Service name is undefined or not a string:', service);
            }
        });
        
        setServices(data); 
    } catch (error) {
        console.error('Error fetching services:', error);
    }
  };


  const handleSearch = (query) => {
    setSearchQuery(query);

    if (!query) {
      setServices(originalServices);
      return;
    }

    const filteredServices = originalServices.filter(service => {
      const name = service.serviceName ? service.serviceName.toLowerCase() : '';
      const description = service.serviceDescription ? service.serviceDescription.toLowerCase() : '';
    
      return (
        name.includes(query.toLowerCase()) || 
        description.includes(query.toLowerCase())
      );
    });
    
    setServices(filteredServices);
  };

  const renderService = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => router.push(`/bookings/${item.serviceId}`)} 
    >
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.serviceName}</Text>
        <Text style={styles.cardDescription}>{item.serviceDescription}</Text>
        <Text style={styles.cardPrice}>$ {item.price}</Text>
        <Text style={styles.cardVendor}>Vendor: {item.vendorBusinessName}</Text>
        <Text style={styles.cardRating}>Rating: {item.averageRating.toFixed(1)}</Text>
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
