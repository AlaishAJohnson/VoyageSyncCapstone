import React, { useState, useEffect } from 'react';
import {View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Modal, TextInput, Button, Alert,} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native';

const BACKEND_URL = 'http://localhost:8080';

const VendorHome = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [vendorId, setVendorId] = useState(null);
    const [selectedTab, setSelectedTab] = useState('ALL');
    const [rescheduleModalVisible, setRescheduleModalVisible] = useState(false);
    const [selectedBookingId, setSelectedBookingId] = useState(null);
    const [newDate, setNewDate] = useState('');
    const [newTime, setNewTime] = useState('');

    const authHeader = 'Basic ' + btoa('admin:admin');
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

    const fetchBookings = async (confirmationStatus) => {
        if (!vendorId) return;

        setLoading(true);
        setError(null);

        try {
            let url = `${BACKEND_URL}/api/bookings/vendor/${vendorId}`;
            if (confirmationStatus && confirmationStatus !== 'ALL') {
                url = `${BACKEND_URL}/api/bookings/vendor/${vendorId}/${confirmationStatus}`;
            }

            const response = await axios.get(url, {
                headers: { Authorization: authHeader },
            });

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

    const updateBookingStatus = async (bookingId, action) => {
        const urlMap = {
            accept: `/api/bookings/accept/${bookingId}`,
            reject: `/api/bookings/reject/${bookingId}`,
            cancel: `/api/bookings/cancel/${bookingId}`,
        };

        try {
            const response = await axios.put(`${BACKEND_URL}${urlMap[action]}`, null, {
                headers: { Authorization: authHeader },
            });
            Alert.alert('Success', `Booking ${action}ed successfully`);
            fetchBookings(selectedTab); // Refresh bookings
        } catch (error) {
            console.error(`Error updating booking (${action}):`, error);
            Alert.alert('Error', `Failed to ${action} booking. Please try again.`);
        }
    };

    const handleReschedule = async () => {
        if (!newDate || !newTime) {
            Alert.alert('Error', 'Please provide both date and time.');
            return;
        }

        try {
            await axios.put(
                `${BACKEND_URL}/api/bookings/reschedule/${selectedBookingId}`,
                null,
                {
                    params: { newDate, newTime },
                    headers: { Authorization: authHeader },
                }
            );
            Alert.alert('Success', 'Booking rescheduled successfully');
            setRescheduleModalVisible(false);
            fetchBookings(selectedTab); // Refresh bookings
        } catch (error) {
            console.error('Error rescheduling booking:', error);
            Alert.alert('Error', 'Failed to reschedule booking. Please try again.');
        }
    };

    useEffect(() => {
        const initialize = async () => {
            await getVendorId();
        };
        initialize();
    }, []);

    useEffect(() => {
        if (vendorId) {
            fetchBookings(selectedTab);
        }
    }, [vendorId, selectedTab]);

    const renderBookingCard = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.title}>Booking Information</Text>
            <Text style={styles.body}>Booking ID: {item.bookingId}</Text>
            <Text style={styles.date}>Date: {new Date(item.bookingDate).toDateString()}</Text>
            <Text style={styles.time}>Time: {new Date(item.bookingTime).toLocaleTimeString()}</Text>
            <Text style={styles.confirmationStatus}>Status: {item.confirmationStatus}</Text>
            <Text style={styles.serviceName}>Service Name: {item.serviceName}</Text>
            <Text style={styles.serviceDescription}>Description: {item.serviceDescription}</Text>
            <Text style={styles.serviceLocation}>Location: {item.location}</Text>

            {item.confirmationStatus === 'PENDING' && (
                <View style={styles.actionButtons}>
                    <Button title="Accept" onPress={() => updateBookingStatus(item.bookingId, 'accept')} />
                    <Button title="Reject" onPress={() => updateBookingStatus(item.bookingId, 'reject')} />
                    <Button title="Cancel" onPress={() => updateBookingStatus(item.bookingId, 'cancel')} />
                    <Button
                        title="Reschedule"
                        onPress={() => {
                            setSelectedBookingId(item.bookingId);
                            setRescheduleModalVisible(true);
                        }}
                    />
                </View>
            )}

            {item.confirmationStatus === 'CONFIRMED' && (
                <View style={styles.actionButtons}>
                    <Button
                        title="Reschedule"
                        onPress={() => {
                            setSelectedBookingId(item.bookingId);
                            setRescheduleModalVisible(true);
                        }}
                    />
                </View>
            )}
        </View>
    );
    const renderTabs = () => {
        const tabs = ['ALL','CONFIRMED', 'RESCHEDULED','PENDING', 'REJECTED'];
        return (
            <ScrollView
                horizontal
                contentContainerStyle={styles.tabsContainer1}
                showsHorizontalScrollIndicator={false}
            >
                {tabs.map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.tab1, selectedTab === tab && styles.activeTab1]}
                        onPress={() => setSelectedTab(tab)}
                    >
                        <Text style={[styles.tabText1, selectedTab === tab && styles.activeTabText1]}>
                            {tab} {/* Keep the tab name static */}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        );
    };
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
                {renderTabs()}
                <FlatList
                    data={bookings}
                    keyExtractor={(item) => item.bookingId.toString()}
                    renderItem={renderBookingCard}
                    contentContainerStyle={{ paddingBottom: 16 }}
                    ListEmptyComponent={<Text style={styles.emptyText}>No bookings {selectedTab}.</Text>}
                />
                <Modal visible={rescheduleModalVisible} animationType="slide" transparent={true}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Reschedule Booking</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter new date (YYYY-MM-DD)"
                            value={newDate}
                            onChangeText={setNewDate}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Enter new time (HH:MM)"
                            value={newTime}
                            onChangeText={setNewTime}
                        />
                        <View style={styles.modalButtons}>
                            <Button title="Submit" onPress={handleReschedule} />
                            <Button title="Cancel" onPress={() => setRescheduleModalVisible(false)} />
                        </View>
                    </View>
                </Modal>
            </View>
        </SafeAreaView>
    );
};
const styles= StyleSheet.create({
    tabsContainer1: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingVertical: 8,
    },
    tab1: {
        width: 120,
        height: 40,
        //paddingVertical: 8,
        //paddingHorizontal: 8,
        borderRadius: 20,
        backgroundColor: '#E0E0E0',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    activeTab1: {
        backgroundColor: '#0B7784',
    },
    tabText1: {
        color: '#000000',
        fontWeight: 'bold',
        fontSize: 14,
        textAlign: 'center',
    },
    activeTabText1: {
        color: '#fff',
    },
    emptyText1: {
        textAlign: 'center',
        fontSize: 10,
        color: '#000000',
        marginTop: 16,
    },
    //^^ everything above is for the 4 tabs filtering the bookings
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
        padding: 16,
        marginBottom: 16,
        elevation: 3,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    body: {
        fontSize: 14,
        marginBottom: 4,
        color: '#333',
    },
    date: {
        fontSize: 14,
        color: '#333',
        marginBottom: 4,
        fontWeight: 'bold'
    },
    time: {
        fontSize: 14,
        color: '#333',
        marginBottom: 4,
    },
    confirmationStatus: {
        fontSize: 14,
        color: '#0B7784',
        marginBottom: 4,
        fontWeight: 'bold',
    },
    serviceName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    serviceDescription: {
        fontSize: 14,
        color: '#333',
        marginBottom: 4,
    },
    serviceLocation: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    tabsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 16,
    },
    tab: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#E0E0E0',
    },
    activeTab: {
        backgroundColor: '#0B7784',
    },
    tabText: {
        color: '#555',
        fontWeight: 'bold',
    },
    activeTabText: {
        color: '#fff',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        fontSize: 16,
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#555',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#fff',
        backgroundColor: '#0B7784',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    input: {
        width: '80%',
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
    },
});
export default VendorHome;
