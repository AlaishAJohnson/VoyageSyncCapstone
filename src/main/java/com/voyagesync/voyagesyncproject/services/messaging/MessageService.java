package com.voyagesync.voyagesyncproject.services.messaging;

import com.voyagesync.voyagesyncproject.controllers.adminreports.reportsDTO;
import com.voyagesync.voyagesyncproject.models.messaging.Messages;
import com.voyagesync.voyagesyncproject.repositories.messaging.MessagesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import java.util.List;



import com.voyagesync.voyagesyncproject.models.messaging.Messages;
import com.voyagesync.voyagesyncproject.repositories.messaging.MessagesRepository;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class MessageService {
    private final MessagesRepository messagesRepository;

    @Autowired
    private MongoTemplate mongoTemplate;

    @Repository
    public interface MessagesRepository extends MongoRepository<Messages, String> {
        // Add custom queries if needed, e.g., findByTripId
    }

    @Service
    public class MessageServiceImpl implements MessageServiceInt {

        private final MessagesRepository messagesRepository;

        public MessageServiceImpl(MessagesRepository messagesRepository) {
            this.messagesRepository = messagesRepository;
        }

        @Override
        public List<Messages> getAllMessages() {
            // Fetch all messages from the database using the repository
            return messagesRepository.findAll();
        }
    }
    public MessageService(final MessagesRepository messagesRepository) {
        this.messagesRepository = messagesRepository;
    }

    public List<Messages> getAllMessages(){
        return messagesRepository.findAll();
    }
}
