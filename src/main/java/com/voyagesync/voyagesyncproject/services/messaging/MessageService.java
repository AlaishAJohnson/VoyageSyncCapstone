package com.voyagesync.voyagesyncproject.services.messaging;

import com.voyagesync.voyagesyncproject.models.messaging.Messages;
import com.voyagesync.voyagesyncproject.repositories.messaging.MessagesRepository;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;

@Service
public class MessageService {
    private final MessagesRepository messagesRepository;
    public MessageService(final MessagesRepository messagesRepository) {
        this.messagesRepository = messagesRepository;
    }

    public List<Messages> getAllMessages(){
        return messagesRepository.findAll();
    }

    public Messages createMessage(Messages message) {
        message.setMessageStatus(Messages.MessageStatus.SENT);
        message.setTimeSent(LocalDateTime.ofInstant(Instant.ofEpochMilli(System.currentTimeMillis()), ZoneOffset.UTC));
        return messagesRepository.save(message);
    }
    public List<Messages> getMessagesBySenderId(ObjectId senderId) {
        return messagesRepository.findBySenderId(senderId);
    }

    // Find messages by receiverId
    public List<Messages> getMessagesByReceiverId(ObjectId receiverId) {
        return messagesRepository.findByReceiverId(receiverId);
    }

}
