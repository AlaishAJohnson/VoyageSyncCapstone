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
    const [messageType, setMessageType] = useState('TEXT');
    const [messageModalVisible, setMessageModalVisible] = useState(false);

    const authHeader = 'Basic ' + btoa('admin:admin');

    // Get vendor ID based on the logged-in user
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
            setError('Failed to retrieve vendor ID.');
        }
    };

    // Fetch users by role (users with the role 'user')
    const fetchUsersByRole = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${BACKEND_URL}/api/users/role/user`, {
                headers: { Authorization: authHeader },
            });
            if (response.data) {
                setUsers(response.data);
            } else {
                setError('No users found');
            }
        } catch (err) {
            setError('Failed to fetch users.');
        } finally {
            setLoading(false);
        }
    };
    // Fetch messages for a specific user (receiver)
    // const fetchMessages = async () => {
    //     setLoading(true);
    //     try {
    //         const response = await axios.post(
    //             `${BACKEND_URL}/api/threads/messages/create/${vendorId}/${receiverId}`,
    //             { content: '', messageType: 'TEXT' },
    //             { headers: { Authorization: authHeader } }
    //         );
    //         if (response.data) {
    //             setMessages(response.data.messages);
    //         } else {
    //             setError('No messages found.');
    //         }
    //     } catch (err) {
    //         setError('Failed to fetch messages.');
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // Send a new message
    const sendMessage = async () => {
        if (!messageText.trim()) {
            Alert.alert('Error', 'Message cannot be empty.');
            return;
        }
        const messageRequest = {
            content: messageText,
            messageType: "TEXT",
            // No threadId needed, backend will generate it
        };

        console.log("Sending message:", messageRequest);  // Debugging line

        try {
            const response = await axios.post(
                `${BACKEND_URL}/api/threads/messages/create/${vendorId}/${receiverId}`,
                messageRequest,
                { headers: { Authorization: authHeader } }
            );
            if (response.data) {
                Alert.alert('Success', 'Message sent successfully');
                setMessages((prevMessages) => [...prevMessages, response.data]);
                setMessageText('');
            }
        } catch (err) {
            setError('Failed to send message.');
        }
    };

    useEffect(() => {
        getVendorId();
    }, []);

    useEffect(() => {
        if (vendorId) {
            fetchUsersByRole();
        }
    }, [vendorId]);
    const renderUserCard = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.title}>User: {item.firstName} {item.lastName}</Text>
            <TouchableOpacity
                style={styles.messageButton}
                onPress={() => {
                    setReceiverId(item.userId);
                    // fetchMessages(); // Fetch messages for this user
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
                <Text style={styles.titleText}>Start A Conversation</Text>
                <FlatList
                    data={users}
                    keyExtractor={(item) => item.userId}
                    renderItem={renderUserCard}
                    ListEmptyComponent={<Text style={styles.emptyText}>No users found.</Text>}
                />
                {/* Message Modal */}
                <Modal visible={messageModalVisible} animationType="slide" transparent={true}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Message Inbox</Text>
                        <FlatList
                            data={messages}
                            keyExtractor={(item) => item.messageId}
                            renderItem={({ item }) => (
                                <Text style={styles.messageText}>{item.content}</Text>
                            )}
                        />
                        {/* Message Type Selector */}
                        <View style={styles.messageTypeSelector}>
                            {["TEXT", "IMAGE", "VIDEO", "COMBINED"].map((type) => (
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
    safeArea: { flex: 1, paddingTop: 20 },
    container: { padding: 16 },
    titleText: { fontSize: 24, fontWeight: 'bold', color: '#0B7784', textAlign: 'center' },
    card: { backgroundColor: '#d9d7d7', padding: 16, marginBottom: 8, borderRadius: 12 },
    messageButton: { backgroundColor: '#0B7784', padding: 10, borderRadius: 8, marginTop: 12 },
    messageButtonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 50, color: '#fff', backgroundColor: '#0B7784', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
    messageText: { fontSize: 14, color: '#333', marginBottom: 4 },
    messageTypeSelector: { flexDirection: 'row', justifyContent: 'center', marginBottom: 10 },
    tab: { paddingVertical: 6, paddingHorizontal: 16, borderRadius: 16, borderWidth: 1, borderColor: '#0B7784', marginRight: 10, backgroundColor: '#fff' },
    activeTab: { backgroundColor: '#0B7784' },
    activeTabText: { color: '#fff' },
    tabText: { fontSize: 15, color: '#0B7784' },
    input: { width: '80%', backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 16, borderWidth: 1, borderColor: '#ccc' },
    modalButtons: { flexDirection: 'row', justifyContent: 'space-between', width: '80%' },
    emptyText: { textAlign: 'center', color: '#ccc' },
    errorText: { color: 'red', textAlign: 'center' },
});
export default VendorMessages;
