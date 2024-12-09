import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Modal, TextInput, Button, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native';

const BACKEND_URL = 'http://localhost:8080';

const VendorMessages = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [vendorId, setVendorId] = useState(null);
    const [selectedTab, setSelectedTab] = useState('ALL');
    const [messages, setMessages] = useState([]);
    const [selectedBookingId, setSelectedBookingId] = useState(null);
    const [messageText, setMessageText] = useState('');
    const [messageModalVisible, setMessageModalVisible] = useState(false);

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

    const fetchMessages = async (bookingId) => {
        try {
            const response = await axios.get(`${BACKEND_URL}/api/threads/messages/`, {
                headers: { Authorization: authHeader },
            });
            if (response.data) {
                setMessages(response.data);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const sendMessage = async () => {
        if (!messageText.trim()) {
            Alert.alert('Error', 'Message cannot be empty.');
            return;
        }

        try {
            await axios.post(
                `${BACKEND_URL}/api/threads/messages/create/${senderId}/${receiverId}`,
                { bookingId: selectedBookingId, message: messageText },
                {
                    headers: { Authorization: authHeader },
                }
            );
            Alert.alert('Success', 'Message sent successfully');
            fetchMessages(selectedBookingId); // Refresh messages
            setMessageModalVisible(false); // Close modal
            setMessageText(''); // Clear message input
        } catch (error) {
            console.error('Error sending message:', error);
            Alert.alert('Error', 'Failed to send message. Please try again.');
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

            {/* Show send message button based on confirmation status */}
            {['PENDING', 'CONFIRMED', 'REJECTED', 'CANCELLED', 'RESCHEDULED'].includes(item.confirmationStatus) && (
                <TouchableOpacity
                    style={styles.messageButton}
                    onPress={() => {
                        setSelectedBookingId(item.bookingId);
                        fetchMessages(item.bookingId);
                        setMessageModalVisible(true);
                    }}
                >
                    <Text style={styles.messageButtonText}>Send Message</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    const renderTabs = () => {
        const tabs = ['ALL', 'CONFIRMED', 'RESCHEDULED', 'PENDING', 'REJECTED'];
        return (
            <ScrollView
                horizontal
                contentContainerStyle={styles.tabsContainer}
                showsHorizontalScrollIndicator={false}
            >
                {tabs.map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.tab, selectedTab === tab && styles.activeTab]}
                        onPress={() => setSelectedTab(tab)}
                    >
                        <Text style={[styles.tabText, selectedTab === tab && styles.activeTabText]}>
                            {tab}
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
                    contentContainerStyle={{ paddingBottom: 88 }}
                    ListEmptyComponent={<Text style={styles.emptyText}>No bookings {selectedTab}.</Text>}
                />
                {/* Message Modal */}
                <Modal visible={messageModalVisible} animationType="slide" transparent={true}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Message Inbox</Text>
                        <FlatList
                            data={messages}
                            keyExtractor={(item) => item.messageId.toString()}
                            renderItem={({ item }) => (
                                <Text style={styles.messageText}>{item.message}</Text>
                            )}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Type your message..."
                            value={messageText}
                            onChangeText={setMessageText}
                        />
                        <View style={styles.modalButtons}>
                            <Button title="Send" onPress={sendMessage} />
                            <Button title="Cancel" onPress={() => setMessageModalVisible(false)} />
                        </View>
                    </View>
                </Modal>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    messageButton: {
        backgroundColor: '#0B7784',
        padding: 10,
        borderRadius: 8,
        marginTop: 12,
    },
    messageButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    messageText: {
        fontSize: 14,
        color: '#333',
        marginBottom: 4,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgb(213,210,210)',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 50,
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
    tabsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
        paddingHorizontal: 16,
        paddingTop: 10,
    },
    tab: {
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#0B7784',
        marginRight: 10,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeTab: {
        backgroundColor: '#0B7784',
    },
    activeTabText: {
        color: '#fff',
    },
    tabText: {
        fontSize: 15,
        color: '#0B7784',
    },
    card: {
        backgroundColor: '#d9d7d7',
        padding: 16,
        marginBottom: 8,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
    },
});
export default VendorMessages;
