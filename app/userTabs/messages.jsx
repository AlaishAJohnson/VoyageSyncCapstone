import React, { useState } from 'react';
import './MessagesView.css'; // Assuming CSS is handled separately

const MessagesView = () => {
  const [messages, setMessages] = useState([
    { id: 1, content: 'Hello!', isOutgoing: true },
    { id: 2, content: 'Hi, when are we meeting?', isOutgoing: false },
    { id: 3, content: 'I am heading out now!', isOutgoing: true },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const outgoingMessageBubble = '#0294FF'; // Outgoing message bubble color
  const incomingMessageBubble = '#262629'; // Incoming message bubble color

  const handleEdit = () => {
    console.log('Pressed Edit');
  };

  const handleSend = () => {
    if (newMessage.trim() === '') return; // Prevent sending empty messages

    // Add the new message to the list
    const newMessageObject = {
      id: messages.length + 1, // Generate a unique ID
      content: newMessage,
      isOutgoing: true, // Outgoing messages are user-sent
    };
    setMessages([...messages, newMessageObject]);
    setNewMessage(''); // Clear the input field
  };

  return (
    <div className="messages-view">
      <header className="navigation-bar">
        
        <h1>Messages</h1>
        <div className="search-bar">
          <input type="text" placeholder="Search..." />
        </div>
      </header>
      <main className="messages-list">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message-bubble ${message.isOutgoing ? 'outgoing' : 'incoming'}`}
            style={{
              backgroundColor: message.isOutgoing
                ? outgoingMessageBubble
                : incomingMessageBubble,
            }}
          >
            {message.content}
          </div>
        ))}
      </main>
      <footer className="message-input">
        <input
          type="text"
          value={newMessage}
          placeholder="Type your message..."
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={handleSend}>Send</button>
      </footer>
    </div>
  );
};

export default MessagesView;
