import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

const CreateVendorService = () => {
  const router = useRouter();

  const [serviceName, setServiceName] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [price, setPrice] = useState('');
  const [vendorBusinessName, setVendorBusinessName] = useState('');
  const [serviceImage, setServiceImage] = useState('');
  const [serviceAvailability, setServiceAvailability] = useState([]);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  const handleAddAvailability = () => {
    setServiceAvailability([...serviceAvailability, { dateOfService: newDate, timeOfService: newTime }]);
    setNewDate('');
    setNewTime('');
  };

  const handleCreateService = async () => {
    const newService = {
      serviceName,
      serviceDescription,
      price: parseFloat(price),
      vendorBusinessName,
      serviceImage,
      serviceAvailability,
    };

    try {
      const response = await axios.post('https://your-api-url.com/api/services', newService);
      console.log('Service created:', response.data);
      router.push('/services');
    } catch (error) {
      console.error('Error creating service:', error.response?.data || error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create a New Service</Text>

      <TextInput
        placeholder="Service Name"
        value={serviceName}
        onChangeText={setServiceName}
        style={styles.input}
      />

      <TextInput
        placeholder="Service Description"
        value={serviceDescription}
        onChangeText={setServiceDescription}
        style={styles.input}
      />

      <TextInput
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        placeholder="Business Name"
        value={vendorBusinessName}
        onChangeText={setVendorBusinessName}
        style={styles.input}
      />

      <TextInput
        placeholder="Image URL"
        value={serviceImage}
        onChangeText={setServiceImage}
        style={styles.input}
      />

      <View style={styles.availabilitySection}>
        <Text style={styles.subHeader}>Add Availability</Text>
        <TextInput
          placeholder="Date (YYYY-MM-DD)"
          value={newDate}
          onChangeText={setNewDate}
          style={styles.input}
        />
        <TextInput
          placeholder="Time (HH:MM)"
          value={newTime}
          onChangeText={setNewTime}
          style={styles.input}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddAvailability}>
          <Text style={styles.addButtonText}>Add Date & Time</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.availabilityList}>
        {serviceAvailability.map((availability, index) => (
          <View key={index} style={styles.availabilityItem}>
            <Ionicons name="calendar-outline" size={20} color="#0B7784" />
            <Text>{availability.dateOfService} at {availability.timeOfService}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.createButton} onPress={handleCreateService}>
        <Text style={styles.createButtonText}>Create Service</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  availabilitySection: {
    marginVertical: 20,
  },
  subHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#0B7784',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  availabilityList: {
    marginVertical: 20,
  },
  availabilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  createButton: {
    backgroundColor: '#0B7784',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CreateVendorService;
