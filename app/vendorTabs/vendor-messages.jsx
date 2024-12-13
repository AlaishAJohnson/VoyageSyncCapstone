import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Modal, TextInput, Button, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKEND_URL = 'http://localhost:8080';
const VendorMessages = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [vendorId, setVendorId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [receiverId, setReceiverId] = useState(null);
    const [messageText, setMessageText] = useState('');
    const [messageType, setMessageType] = useState('TEXT'); // New state for message type
    const [messageModalVisible, setMessageModalVisible] = useState(false);
    const [threadId, setThreadId] = useState(null); // State for threadId

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

    const fetchUsersByRole = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${BACKEND_URL}/api/users/role/user`, {
                headers: { Authorization: authHeader },
            });
            if (response.data && Array.isArray(response.data)) {
                setUsers(response.data);
            } else {
                throw new Error('No users found');
            }
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Failed to fetch users. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async () => {
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
    // Function to check and create a new thread if none exists
    const checkOrCreateThread = async () => {
        try {
            // First, check if a thread already exists between the vendor and the receiver
            const response = await axios.get(`${BACKEND_URL}/api/threads/${threadId}`, {
                headers: { Authorization: authHeader },
            })
            // If a thread exists, use the existing threadId
            if (response.data && response.data.threadId) {
                setThreadId(response.data.threadId);
            } else {
                // If no thread exists, create a new one
                const newThreadResponse = await axios.post(
                    `${BACKEND_URL}/api/threads/create`,
                    { vendorId, receiverId }, // Send vendor and receiver ID to create a new thread
                    { headers: { Authorization: authHeader } }
                );
                if (newThreadResponse.data && newThreadResponse.data.threadId) {
                    setThreadId(newThreadResponse.data.threadId);
                }
            }
        } catch (error) {
            console.error('Error checking or creating thread:', error);
        }
    };
    const sendMessage = async () => {
        if (!messageText.trim()) {
            Alert.alert('Error', 'Message cannot be empty.');
            return;
        }
        // Check or create a thread before sending the message
        if (!threadId) {
            await checkOrCreateThread();
        }
        // Log the vendorId, receiverId, and threadId
        console.log('Sending message from Vendor ID:', vendorId);
        console.log('To Receiver ID:', receiverId);
        console.log('Thread ID:', threadId);
        // Create the message request with threadId
        const messageRequest = {
            content: messageText,
            messageType: messageType,
            threadId: threadId,  // Include threadId here
        };
        // Log the messageRequest to see the data being sent
        console.log('Message Data:', messageRequest);
        try {
            await axios.post(
                `${BACKEND_URL}/api/threads/messages/create/${vendorId}/${receiverId}`,
                messageRequest,
                {
                    headers: { Authorization: authHeader },
                }
            );
            Alert.alert('Success', 'Message sent successfully');
            fetchMessages(); // Refresh messages
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
            fetchUsersByRole();
        }
    }, [vendorId]);
    const renderUserCard = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.title}>User Information</Text>
            <Text style={styles.firstName}>First Name: {item.firstName}</Text>
            <Text style={styles.lastName}>Last Name: {item.lastName}</Text>
            <Text style={styles.email}>Email: {item.email}</Text>
            <TouchableOpacity
                style={styles.messageButton}
                onPress={() => {
                    setReceiverId(item.userId); // Set user as receiver
                    fetchMessages(); // Messages may not need booking context
                    setMessageModalVisible(true);
                }}
            >
                <Text style={styles.messageButtonText}>Send Message</Text>
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
            <View style={styles.container}>
                <Text style={styles.titleText}>Start A Conversation </Text>
                <FlatList
                    data={users}
                    keyExtractor={(item) => item.userId.toString()}
                    renderItem={renderUserCard}
                    contentContainerStyle={{ paddingBottom: 88 }}
                    ListEmptyComponent={<Text style={styles.emptyText}>No users found.</Text>}
                />
                {/* Message Modal */}
                <Modal visible={messageModalVisible} animationType="slide" transparent={true}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Message Inbox</Text>
                        <FlatList
                            data={messages}
                            keyExtractor={(item) => item.messageId.toString()}
                            renderItem={({ item }) => (
                                <Text style={styles.messageText}>{item.content}</Text> // Display message content
                            )}
                        />
                        {/* Message Type Selection */}
                        <View style={styles.messageTypeSelector}>
                            {['TEXT', 'IMAGE', 'VIDEO', 'COMBINED'].map((type) => (
                                <TouchableOpacity
                                    key={type}
                                    style={[styles.tab, messageType === type && styles.activeTab]}
                                    onPress={() => setMessageType(type)}
                                >
                                    <Text style={[styles.tabText, messageType === type && styles.activeTabText]}>
                                        {type}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
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
    titleText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0B7784',
        textAlign: 'center',
        marginVertical: 20,
    },
});
export default VendorMessages;
