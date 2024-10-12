package com.example.voyagesynccapstone.interfaces.messaging;

import com.example.voyagesynccapstone.model.messaging.Messages;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessagesRepository extends MongoRepository<Messages, ObjectId> {
    List<Messages> findByThreadID(ObjectId threadID);
    List<Messages> findBySenderID(ObjectId senderID);
    List<Messages> findByReceiverID(ObjectId receiverID);
    List<Messages> findByMessageStatus(Messages.MessageStatus status);
}
