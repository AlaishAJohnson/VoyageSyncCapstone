import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

const Messages = () => {
  const [messages, setMessages] = useState([
    { id: '1', senderId: 'User1', content: 'Hello, are you ready for the trip?' },
    { id: '2', senderId: 'User2', content: 'Yes, I am all set! Can’t wait to go.' },
    { id: '3', senderId: 'User1', content: 'Great! Let’s meet at the pickup point at 6 PM.' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  // Function to send a new message (for testing purposes)
  const sendMessage = () => {
    if (newMessage.trim() === '') return;

    const newMsg = {
      id: (messages.length + 1).toString(), // Simple incrementing ID
      senderId: 'User1', // Replace with current user's ID when dynamic
      content: newMessage,
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  // Render individual messages
  const renderMessage = ({ item }) => (
    <View style={styles.messageItem}>
      <Text style={styles.messageSender}>{item.senderId}</Text>
      <Text style={styles.messageContent}>{item.content}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Messages</Text>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messageList}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Messages;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
  },
  messageList: {
    flexGrow: 1,
    padding: 10,
  },
  messageItem: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
  },
  messageSender: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#555',
  },
  messageContent: {
    fontSize: 16,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#007bff',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
