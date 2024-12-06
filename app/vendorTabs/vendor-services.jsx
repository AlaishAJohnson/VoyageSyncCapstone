import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet, Alert, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKEND_URL = 'http://localhost:8080';

const VendorServices = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [vendorId, setVendorId] = useState(null);
    const [newService, setNewService] = useState({
        serviceName: '',
        serviceDescription: '',
        price: '',
        location: '',
        timeFrame: '',
        openSlots: '',
        duration: '',
        typeOfService: '',
    });
    const [showModal, setShowModal] = useState(false);
    const [serviceToUpdate, setServiceToUpdate] = useState(null);

    const authHeader = 'Basic ' + btoa('admin:admin');

    // Fetch Vendor ID
    const getVendorId = async () => {
        try {
            const storedUserId = await AsyncStorage.getItem('userId');
            if (storedUserId) {
                const response = await axios.get(`${BACKEND_URL}/api/vendors/by-user/${storedUserId}`, {
                    headers: { Authorization: authHeader },
                });
                if (response.data && response.data.vendorId) {
                    setVendorId(response.data.vendorId);
                } else {
                    throw new Error('No vendor found for this user.');
                }
            } else {
                throw new Error('User ID not found.');
            }
        } catch (err) {
            console.error('Error fetching vendor ID:', err.message);
            setError('Failed to retrieve vendor ID. Please try again.');
        }
    };

    // Fetch Services for the Vendor
    const fetchVendorServices = async () => {
        if (!vendorId) return;
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${BACKEND_URL}/api/services/by-vendor/${vendorId}`, {
                headers: { Authorization: authHeader },
            });
            setServices(response.data || []);
        } catch (err) {
            console.error('Error fetching services:', err.message);
            setError('Error fetching services.');
        } finally {
            setLoading(false);
        }
    };

    // Add or Update a Service
    const handleSaveService = async () => {
        const { serviceName, serviceDescription, price, location, timeFrame, openSlots, duration, typeOfService } = newService;

        if (!serviceName || !serviceDescription || !price || !location || !timeFrame) {
            Alert.alert('Please fill in all required fields.');
            return;
        }

        try {
            const serviceData = {
                serviceName: serviceName.trim(),
                serviceDescription: serviceDescription.trim(),
                price: parseFloat(price),
                location: location.trim(),
                details: [
                    {
                        timeFrame: timeFrame.trim(),
                        openSlots: openSlots ? parseInt(openSlots) : 0,
                        duration: duration.trim(),
                        typeOfService: typeOfService.trim(),
                    },
                ],
            };

            if (serviceToUpdate && serviceToUpdate.serviceId) {
                // Update existing service
                const response = await axios.put(
                    `${BACKEND_URL}/api/services/update/${serviceToUpdate.serviceId}`,
                    serviceData,
                    { headers: { Authorization: authHeader } }
                );

                setServices((prevServices) =>
                    prevServices.map((service) =>
                        service.serviceId === serviceToUpdate.serviceId ? response.data : service
                    )
                );
                Alert.alert('Service updated successfully!');
            } else {
                // Create new service
                const response = await axios.post(
                    `${BACKEND_URL}/api/services`,
                    { ...serviceData, vendorId },
                    { headers: { Authorization: authHeader } }
                );
                setServices((prevServices) => [...prevServices, response.data]);
                Alert.alert('Service added successfully!');
            }
        } catch (err) {
            console.error('Error saving service:', err.response?.data || err.message);
            Alert.alert('Failed to save service. Please check your inputs.');
        } finally {
            resetServiceForm();
        }
    };

    // Delete a Service
    const deleteService = async (serviceId) => {
        try {
            await axios.delete(`${BACKEND_URL}/api/services/delete/${serviceId}`, {
                headers: { Authorization: authHeader },
            });
            setServices((prevServices) => prevServices.filter((service) => service.serviceId !== serviceId));
            Alert.alert('Service deleted successfully.');
        } catch (err) {
            console.error('Error deleting service:', err.message);
            Alert.alert('Failed to delete service.');
        }
    };


    // Reset Service Form
    const resetServiceForm = () => {
        setNewService({
            serviceName: '',
            serviceDescription: '',
            price: '',
            location: '',
            timeFrame: '',
            openSlots: '',
            duration: '',
            typeOfService: '',
        });
        setServiceToUpdate(null);
        setShowModal(false);
    };

    useEffect(() => {
        const initialize = async () => {
            await getVendorId();
        };
        initialize();
    }, []);

    useEffect(() => {
        if (vendorId) fetchVendorServices();
    }, [vendorId]);


    // Pre-fill form with all fields when updating a service
    const handleUpdatePress = (item) => {
        setServiceToUpdate(item); // Set the entire service object to `serviceToUpdate`
        setNewService({
            serviceName: item.serviceName || '',
            serviceDescription: item.serviceDescription || '',
            price: item.price ? item.price.toString() : '',
            location: item.location || '',
            timeFrame: item.details?.[0]?.timeFrame || '',
            openSlots: item.details?.[0]?.openSlots?.toString() || '',
            duration: item.details?.[0]?.duration || '',
            typeOfService: item.details?.[0]?.typeOfService || '',
        });
        setShowModal(true);
    };

    // Add New Service Button
    const handleAddServicePress = () => {
        setServiceToUpdate(null);
        resetServiceForm();
        setShowModal(true);
    };

    const renderServiceCard = ({ item }) => (
        <View style={styles.card} key={item.serviceId}>
            <Text style={styles.title}>{item.serviceName}</Text>
            <Text style={styles.description}>{item.serviceDescription}</Text>
            <Text style={styles.price}>Price: ${item.price}</Text>
            <Text style={styles.location}>Location: {item.location}</Text>
            <Text style={styles.timeFrame}>Time Frame: {item.details.map((d) => d.timeFrame).join(', ')}</Text>
            <TouchableOpacity style={styles.deleteButton} onPress={() => deleteService(item.serviceId)}>
                <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.updateButton}
                onPress={() => handleUpdatePress(item)}
            >
                <Text style={styles.buttonText}>Update</Text>
            </TouchableOpacity>
        </View>
    );

    if (loading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <ActivityIndicator size="large" color="#0B7784" />
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <Text style={styles.errorText}>{error}</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <TouchableOpacity style={styles.addButton} onPress={handleAddServicePress}>
                <Text style={styles.addButtonText}>+ Add Service</Text>
            </TouchableOpacity>
            <FlatList
                data={services}
                keyExtractor={(item, index) => (item.serviceId ? item.serviceId.toString() : index.toString())}
                renderItem={renderServiceCard}
            />
            {/* Modal for creating or updating services */}
            <Modal visible={showModal} animationType="slide">
                <View style={styles.modalContent}>
                    <TextInput
                        style={styles.input}
                        placeholder="Service Name"
                        value={newService.serviceName}
                        onChangeText={(text) => setNewService({ ...newService, serviceName: text })}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Service Description"
                        value={newService.serviceDescription}
                        onChangeText={(text) => setNewService({ ...newService, serviceDescription: text })}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Price"
                        keyboardType="numeric"
                        value={newService.price}
                        onChangeText={(text) => setNewService({ ...newService, price: text })}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Location"
                        value={newService.location}
                        onChangeText={(text) => setNewService({ ...newService, location: text })}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Time Frame"
                        value={newService.timeFrame}
                        onChangeText={(text) => setNewService({ ...newService, timeFrame: text })}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Open Slots"
                        keyboardType="numeric"
                        value={newService.openSlots}
                        onChangeText={(text) => setNewService({ ...newService, openSlots: text })}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Duration"
                        value={newService.duration}
                        onChangeText={(text) => setNewService({ ...newService, duration: text })}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Type of Service"
                        value={newService.typeOfService}
                        onChangeText={(text) => setNewService({ ...newService, typeOfService: text })}
                    />
                    <TouchableOpacity style={styles.saveButton} onPress={handleSaveService}>
                        <Text style={styles.buttonText}>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelButton} onPress={resetServiceForm}>
                        <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, paddingTop: 20, backgroundColor: '#fff' },
    card: { padding: 10, borderWidth: 1, marginBottom: 10 },
    title: { fontSize: 18, fontWeight: 'bold' },
    description: { fontSize: 14, marginVertical: 5 },
    price: { fontSize: 14, marginVertical: 5 },
    location: { fontSize: 14, marginVertical: 5 },
    timeFrame: { fontSize: 14, marginVertical: 5 },
    deleteButton: { backgroundColor: '#e70505', padding: 10, marginTop: 10, alignItems: 'center', borderRadius: 20, fontSize:16 },
    updateButton: { backgroundColor: '#5fa6f5', padding: 10, marginTop: 10, alignItems: 'center', borderRadius: 20, fontSize:16 },
    buttonText: { color: '#fff', fontSize: 10 },
    addButton: { backgroundColor: '#5fa6f5', padding: 15, margin: 20, alignItems: 'center', borderRadius: 20 },
    addButtonText: { color: '#fff', fontSize: 20 },
    modalContent: { padding: 20, backgroundColor: '#fff', flex: 1, justifyContent: 'center' },
    input: { borderWidth: 1, padding: 10, marginVertical: 5, borderRadius: 5 },
    saveButton: { backgroundColor: '#07a253', padding: 10, marginTop: 20, alignItems: 'center', borderRadius: 20 },
    cancelButton: { backgroundColor: '#bbbaba', padding: 10, marginTop: 10, alignItems: 'center', borderRadius: 20 },
    errorText: { color: 'red', textAlign: 'center', marginTop: 20 },
});

export default VendorServices;
