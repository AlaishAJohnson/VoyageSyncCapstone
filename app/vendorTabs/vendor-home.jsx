import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKEND_URL = 'http://localhost:8080';

const VendorHome = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [vendorId, setVendorId] = useState(null);

    const authHeader = 'Basic ' + btoa('admin:admin');

    const getVendorId = async () => {
        try {
            const storedUserId = await AsyncStorage.getItem('userId');
            console.log('Stored userId from AsyncStorage:', storedUserId);

            if (storedUserId) {
                const response = await axios.get(`${BACKEND_URL}/api/vendors/by-user/${storedUserId}`, {
                    headers: {
                        'Authorization': authHeader,
                    },
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

    // Fetch all bookings for the vendor
    const fetchAllBookings = async () => {
        if (!vendorId) {
            console.error('Vendor ID is missing, cannot fetch bookings');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const url = `${BACKEND_URL}/api/bookings/vendor/${vendorId}`;
            console.log('Fetching bookings for vendorId:', vendorId);

            const response = await axios.get(url, {
                headers: {
                    'Authorization': authHeader,  // Add the auth header here
                },
            });
            console.log('Response data from bookings API:', response.data);

            if (response.data && Array.isArray(response.data)) {
                setBookings(response.data);
            } else {
                throw new Error('No bookings found');
            }
        } catch (err) {
            console.error('Error fetching bookings:', err);
            setError('Failed to fetch bookings. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Initialize vendor ID and bookings on component mount
    useEffect(() => {
        const initialize = async () => {
            await getVendorId();
        };
        initialize();
    }, []);

    // Fetch bookings whenever vendorId changes
    useEffect(() => {
        if (vendorId) {
            fetchAllBookings();
        }
    }, [vendorId]);

    // Render booking card

    const renderBookingCard = ({ item }) => (
        <TouchableOpacity style={styles.card} >
            <Text style={styles.title}>Here are Your Booking Information</Text>
            <Text style={styles.body}>Booking ID: {item.bookingId.toString()}</Text>
            <Text style={styles.date}>Date: {new Date(item.bookingDate).toDateString()}</Text>
            <Text style={styles.time}>Time: {new Date(item.bookingTime).toLocaleTimeString()}</Text>
            <Text style={styles.confirmationStatus}>Status: {item.confirmationStatus}</Text>
            <Text style={styles.itineraryId}>Itinerary ID: {item.itineraryId.toString()}</Text>
            <Text style={styles.serviceId}>Service ID: {item.serviceId.toString()}</Text>
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
                    data={bookings}
                    keyExtractor={(item) => item.bookingId?.toString()}
                    renderItem={renderBookingCard}
                    contentContainerStyle={{ paddingBottom: 16 }}
                    ListEmptyComponent={<Text style={styles.emptyText}>No bookings available.</Text>}
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
    body: {
        fontSize: 14,
        marginVertical: 4,
    },
    date: {
        fontSize: 14,
        marginVertical: 4,
    },
    time: {
        fontSize: 14,
        marginVertical: 4,
    },
    confirmationStatus: {
        fontSize: 14,
        marginVertical: 4,
    },
    itineraryId: {
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

export default VendorHome;
