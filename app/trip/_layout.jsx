import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const TripLayout = () => {
    const router = useRouter();
    const [tripData, setTripData] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const tripId = '67111e82edf3d7f2f6d5458f'; // Replace with dynamic tripId as needed

    const fetchTripData = async () => {
        try {
            const response = await fetch(`http://localhost:8081/api/trips/${tripId}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching trip data:', error);
            return null;
        }
    };

    useEffect(() => {
        let interval;

        const pollTripData = async () => {
            const newData = await fetchTripData();
            if (newData && JSON.stringify(newData) !== JSON.stringify(tripData)) {
                setTripData(newData);
                setNotifications((prevNotifications) => [
                    ...prevNotifications,
                    { id: Date.now(), message: 'Trip details have been updated!' },
                ]);
            }
        };

        // Initial fetch and set interval for polling
        (async () => {
            const initialData = await fetchTripData();
            setTripData(initialData);
        })();

        interval = setInterval(pollTripData, 10000); // Poll every 1 seconds

        return () => clearInterval(interval); // Cleanup on unmount
    }, [tripData]);

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
    };

    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#0B7784',
                },
                headerTintColor: '#F9C2A6',
                headerRight: () => (
                    <View style={{ position: 'relative' }}>
                        <TouchableOpacity onPress={toggleNotifications}>
                            <Ionicons name="notifications" size={24} color="#F9C2A6" />
                        </TouchableOpacity>
                        {showNotifications && (
                            <View style={styles.notificationMenu}>
                                {notifications.map((notification) => (
                                    <Text key={notification.id} style={styles.notificationItem}>
                                        {notification.message}
                                    </Text>
                                ))}
                            </View>
                        )}
                    </View>
                ),
            }}
        >
            <Stack.Screen 
                name='[tripId]'
                options={{
                    title: 'Trip Details',
                    headerBackTitleVisible: false, 
                    headerLeft: () => (
                        <TouchableOpacity 
                            onPress={() => router.push('/userTabs/user-home')}
                            style={{ flexDirection: 'row', alignItems: 'center' }} 
                        >
                            <Ionicons name="arrow-back" size={24} color="#F9C2A6" />
                            <Text style={{ marginLeft: 8, color: '#F9C2A6', fontSize: 18 }}>Home</Text>
                        </TouchableOpacity>
                    ),
                }}
            />
            <Stack.Screen 
                name='create-trip'
                options={{
                    title: 'Create Trip',
                    headerBackTitle: 'Home',
                }}
            />
            <Stack.Screen 
                name='itinerary'
                options={{
                    title: 'Itinerary',
                    headerBackTitle: 'Details',
                }}
            />
        </Stack>
    );
};

const styles = StyleSheet.create({
    notificationMenu: {
        position: 'absolute',
        top: 30,
        right: 0,
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    notificationItem: {
        padding: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        fontSize: 14,
    },
});

export default TripLayout;
