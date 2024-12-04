import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKEND_URL = 'http://localhost:8080';

const VendorServices = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [vendorId, setVendorId] = useState(null);

    // Basic Authentication Header
    const authHeader = 'Basic ' + btoa('admin:admin');

    // Fetch Vendor ID
    const getVendorId = async () => {
        try {
            const storedUserId = await AsyncStorage.getItem('userId');
            console.log('Stored userId from AsyncStorage:', storedUserId);

            if (storedUserId) {
                const response = await axios.get(`${BACKEND_URL}/api/vendors/by-user/${storedUserId}`, {
                    headers: { 'Authorization': authHeader },
                });
                console.log('Response from backend for vendor data:', response.data);

                if (response.data && response.data.vendorId) {
                    setVendorId(response.data.vendorId);
                } else {
                    throw new Error('No vendor found for this user');
                }
            } else {
                throw new Error('User ID not found');
            }
        } catch (error) {
            console.error('Error retrieving vendor ID:', error);
            setError('Failed to retrieve vendor ID. Please try again.');
        }
    };

    // Fetch Services for the Vendor
    const fetchVendorServices = async () => {
        if (!vendorId) {
            console.error('Vendor ID is missing, cannot fetch services');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const url = `${BACKEND_URL}/api/services/by-vendor/${vendorId}`;
            console.log('Fetching services for vendorId:', vendorId);

            const response = await axios.get(url, {
                headers: { 'Authorization': authHeader },
            });
            console.log('Response data from services API:', response.data);

            if (response.data && Array.isArray(response.data)) {
                setServices(response.data);
            } else {
                throw new Error('No services found');
            }
        } catch (err) {
            console.error('Error fetching services:', err);
            setError('Failed to fetch services. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Initialize vendor ID and services on component mount
    useEffect(() => {
        const initialize = async () => {
            await getVendorId();
        };
        initialize();
    }, []);

    // Fetch services whenever vendorId changes
    useEffect(() => {
        if (vendorId) {
            fetchVendorServices();
        }
    }, [vendorId]);

    // Render Service Card
    const renderServiceCard = ({ item }) => (
        <TouchableOpacity style={styles.card}>
            <Text style={styles.title}>Service: {item.serviceName}</Text>
            <Text style={styles.description}>Description: {item.serviceDescription}</Text>
            <Text style={styles.price}>Price: ${item.price}</Text>
            <Text style={styles.availability}>
                Availability: {item.serviceAvailability.length > 0 ? 'Available' : 'Not Available'}
            </Text>
        </TouchableOpacity>
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
            <View style={styles.container}>
                <FlatList
                    data={services}
                    keyExtractor={(item) => item.serviceId}
                    renderItem={renderServiceCard}
                    contentContainerStyle={{ paddingBottom: 16 }}
                    ListEmptyComponent={<Text style={styles.emptyText}>No services available.</Text>}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        padding: 16,
    },
    card: {
        backgroundColor: 'rgba(11, 119, 132, 0.2)',
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
        elevation: 3,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 14,
        marginVertical: 4,
    },
    price: {
        fontSize: 14,
        marginVertical: 4,
    },
    availability: {
        fontSize: 14,
        color: '#555',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#555',
    },
});

export default VendorServices;
