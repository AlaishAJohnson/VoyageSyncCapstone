package com.example.voyagesynccapstone.interfaces.messaging;

import com.example.voyagesynccapstone.model.messaging.Messages;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MessagesRepository extends MongoRepository<Messages, ObjectId> {
}
