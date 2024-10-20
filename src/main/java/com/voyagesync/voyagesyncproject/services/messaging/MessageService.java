package com.voyagesync.voyagesyncproject.services.messaging;

import com.voyagesync.voyagesyncproject.models.messaging.Messages;
import com.voyagesync.voyagesyncproject.repositories.messaging.MessagesRepository;
import org.springframework.stereotype.Service;

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
}
