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
                    setVendorId(response.data.vendorId.toString()); // Ensure it's treated as a string
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
                timeFrame: timeFrame.trim(),
                openSlots: openSlots ? parseInt(openSlots) : 0,
                duration: duration.trim(),
                typeOfService: typeOfService.trim(),
                vendorId: vendorId, // Ensure vendorId is treated as a string
            };

            if (serviceToUpdate && serviceToUpdate.serviceIdAsString) {
                // Update existing service
                const response = await axios.put(
                    `${BACKEND_URL}/api/services/update/${serviceToUpdate.serviceIdAsString}`,
                    serviceData,
                    { headers: { Authorization: authHeader } }
                );

                setServices((prevServices) =>
                    prevServices.map((service) =>
                        service.serviceIdAsString === serviceToUpdate.serviceIdAsString ? response.data : service
                    )
                );
                Alert.alert('Service updated successfully!');
            } else {
                // Create new service
                const response = await axios.post(
                    `${BACKEND_URL}/api/services`,
                    serviceData,
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
    const deleteService = async (serviceIdAsString) => {
        try {
            await axios.delete(`${BACKEND_URL}/api/services/delete/${serviceIdAsString}`, {
                headers: { Authorization: authHeader },
            });
            setServices((prevServices) => prevServices.filter((service) => service.serviceIdAsString !== serviceIdAsString));
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
            timeFrame: item.timeFrame || '',
            openSlots: item.openSlots?.toString() || '',
            duration: item.duration || '',
            typeOfService: item.typeOfService || '',
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
        <View style={styles.card} key={item.serviceIdAsString}>
            <Text style={styles.title}>{item.serviceName}</Text>
            <Text style={styles.description}>{item.serviceDescription}</Text>
            <Text style={styles.price}>Price: ${item.price}</Text>
            <Text style={styles.location}>Location: {item.location}</Text>
            <Text style={styles.timeFrame}>Time Frame: {item.timeFrame}</Text>
            <Text style={styles.duration}>Duration: {item.duration}</Text>
            <Text style={styles.typeOfService}>Service Type: {item.typeOfService}</Text>
            <Text style={styles.openSlots}>Available Slots: {item.openSlots}</Text>
            <TouchableOpacity style={styles.deleteButton} onPress={() => deleteService(item.serviceIdAsString)}>
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
                <Text style={styles.buttonText}>Add New Service</Text>
            </TouchableOpacity>

            <FlatList
                data={services}
                renderItem={renderServiceCard}
                keyExtractor={(item) => {
                    const key = item.serviceIdAsString || item.serviceId || item._id || '';
                    return key.toString();  // Make sure the key is a string, and handle undefined values.
                    }
                }
            />

            {/* Modal for adding or updating a service */}
            <Modal visible={showModal} animationType="slide" onRequestClose={resetServiceForm}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>
                        {serviceToUpdate ? 'Update Service' : 'Add New Service'}
                    </Text>

                    <TextInput
                        style={styles.input}
                        value={newService.serviceName}
                        onChangeText={(text) => setNewService((prev) => ({ ...prev, serviceName: text }))}
                        placeholder="Service Name"
                    />
                    <TextInput
                        style={styles.input}
                        value={newService.serviceDescription}
                        onChangeText={(text) => setNewService((prev) => ({ ...prev, serviceDescription: text }))}
                        placeholder="Service Description"
                    />
                    <TextInput
                        style={styles.input}
                        value={newService.price}
                        onChangeText={(text) => setNewService((prev) => ({ ...prev, price: text }))}
                        placeholder="Price"
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={styles.input}
                        value={newService.location}
                        onChangeText={(text) => setNewService((prev) => ({ ...prev, location: text }))}
                        placeholder="Location"
                    />
                    <TextInput
                        style={styles.input}
                        value={newService.timeFrame}
                        onChangeText={(text) => setNewService((prev) => ({ ...prev, timeFrame: text }))}
                        placeholder="Time Frame"
                    />
                    <TextInput
                        style={styles.input}
                        value={newService.openSlots}
                        onChangeText={(text) => setNewService((prev) => ({ ...prev, openSlots: text }))}
                        placeholder="Open Slots"
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={styles.input}
                        value={newService.duration}
                        onChangeText={(text) => setNewService((prev) => ({ ...prev, duration: text }))}
                        placeholder="Duration"
                    />
                    <TextInput
                        style={styles.input}
                        value={newService.typeOfService}
                        onChangeText={(text) => setNewService((prev) => ({ ...prev, typeOfService: text }))}
                        placeholder="Type of Service"
                    />

                    <TouchableOpacity style={styles.saveButton} onPress={handleSaveService}>
                        <Text style={styles.buttonText}>{serviceToUpdate ? 'Update' : 'Save'}</Text>
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
    safeArea: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
    },
    card: {
        backgroundColor: '#f1f1f1',
        padding: 15,
        marginBottom: 10,
        borderRadius: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 16,
        marginVertical: 5,
    },
    price: {
        fontSize: 14,
        color: '#333',
    },
    location: {
        fontSize: 14,
    },
    timeFrame: {
        fontSize: 14,
    },
    duration: {
        fontSize: 14,
    },
    typeOfService: {
        fontSize: 14,
    },
    openSlots: {
        fontSize: 14,
    },
    deleteButton: {
        backgroundColor: '#e74c3c',
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
        alignItems: 'center',
    },
    updateButton: {
        backgroundColor: '#0B7784',
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    addButton: {
        backgroundColor: '#0B7784',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 15,
    },
    modalContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 15,
        borderRadius: 5,
    },
    saveButton: {
        backgroundColor: '#0B7784',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#e74c3c',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default VendorServices;
