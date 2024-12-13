import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; 

const BACKEND_URL = "http://localhost:8080"; 
const authHeader = 'Basic ' + btoa('admin:admin');

const Explore = () => {
  const [services, setServices] = useState([]);
  const [originalServices, setOriginalServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [industry, setIndustry] = useState('');
  const [filtersApplied, setFiltersApplied] = useState(false); 
  const router = useRouter();

  useEffect(() => {
    // Fetch services only on initial load or when filters are reset
    if (!filtersApplied) {
      fetchAllServices();
    }
  }, []); // Empty dependency array ensures this effect runs only once on mount

  const fetchAllServices = async () => {
    try {
      let url = `${BACKEND_URL}/api/services`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': authHeader, // Include auth header
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched Services:", data);

      setOriginalServices(data);
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query) {
      setServices(originalServices); // Reset to original services when search is cleared
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

  const applyFilters = () => {
    let filteredServices = [...originalServices];

    // Filter by price
    if (price) {
      filteredServices = filteredServices.filter(service => {
        if (price === '50') return service.price < 50;
        if (price === '100') return service.price >= 50 && service.price <= 100;
        if (price === '200') return service.price > 100;
        return true;
      });
    }

    // Filter by industry
    if (industry) {
      filteredServices = filteredServices.filter(service => service.typeOfService === industry);
    }

    setServices(filteredServices);
    setFiltersApplied(true); // Mark filters as applied
  };

  const resetFilters = () => {
    setLocation('');
    setPrice('');
    setIndustry('');
    setFiltersApplied(false); // Reset filter state
    setServices(originalServices); // Reset services to original state
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
          <Text style={styles.location}>Location: {item.location}</Text>
          <Text style={styles.cardPrice}>$ {item.price}</Text>
          <Text style={styles.cardVendor}>Vendor: {item.vendorBusinessName}</Text>
          <Text style={styles.typeOfService}>Type Of Service: {item.typeOfService}</Text>
          <Text style={styles.openSlots}>Open Spots Left: {item.openSlots}</Text>
          <Text style={styles.duration}>Duration of Service: {item.duration}</Text>
          <Text style={styles.cardRating}>Rating: {item.averageRating.toFixed(1)}</Text>
        </View>
      </TouchableOpacity>
  );
  return (
      <SafeAreaView style={styles.container}>
        <View style={styles.searchContainer}>
          <Ionicons name='search' color='black' size={20} />
          <TextInput
              placeholder='Search Services By Name'
              placeholderTextColor="#333"
              value={searchQuery}
              onChangeText={handleSearch}
              style={styles.searchText}
          />
        </View>

        {/* Filter Options */}
        <View style={styles.filterContainer}>
          <Text style={styles.filterTitle}>Filter by:</Text>

          <View style={styles.buttonGroup}>
            <TouchableOpacity
                style={[styles.filterButton, price === '50' && styles.activeButton]}
                onPress={() => setPrice(price === '50' ? '' : '50')}
            >
              <Text style={styles.buttonText}>Under $50</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.filterButton, price === '100' && styles.activeButton]}
                onPress={() => setPrice(price === '100' ? '' : '100')}
            >
              <Text style={styles.buttonText}>$50 - $100</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.filterButton, price === '200' && styles.activeButton]}
                onPress={() => setPrice(price === '200' ? '' : '200')}
            >
              <Text style={styles.buttonText}>Above $100</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.filterButton, industry === 'Restaurant' && styles.activeButton]}
                onPress={() => setIndustry(industry === 'Restaurant' ? '' : 'Restaurant')}
            >
              <Text style={styles.buttonText}>Restaurant</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.filterButton, industry === 'Relaxation' && styles.activeButton]}
                onPress={() => setIndustry(industry === 'Relaxation' ? '' : 'Relaxation')}
            >
              <Text style={styles.buttonText}>Relaxation</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.filterButton, industry === 'Wellness' && styles.activeButton]}
                onPress={() => setIndustry(industry === 'Wellness' ? '' : 'Wellness')}
            >
              <Text style={styles.buttonText}>Wellness</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.filterButton, industry === 'Food' && styles.activeButton]}
                onPress={() => setIndustry(industry === 'Food' ? '' : 'Food')}
            >
              <Text style={styles.buttonText}>Food</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.filterButton, industry === 'Hair Care' && styles.activeButton]}
                onPress={() => setIndustry(industry === 'Hair Care' ? '' : 'Hair Care')}
            >
              <Text style={styles.buttonText}>Hair Care</Text>
            </TouchableOpacity>

          </View>

          <TouchableOpacity onPress={applyFilters} style={styles.filterButton}>
            <Text style={styles.buttonText}>Apply Filters</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={resetFilters} style={styles.filterButton}>
            <Text style={styles.buttonText}>Reset Filters</Text>
          </TouchableOpacity>
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
  filterContainer: {
    marginBottom: 15,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 15,
  },
  filterButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  activeButton: {
    backgroundColor: '#0b7784',
    borderColor: '#0b7784',
    color: 'white'
  },
  buttonText: {
    color: '#333',
    fontWeight: 'bold',
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
