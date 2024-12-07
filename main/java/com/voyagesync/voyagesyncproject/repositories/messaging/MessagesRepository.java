package com.voyagesync.voyagesyncproject.repositories.messaging;

import com.voyagesync.voyagesyncproject.models.messaging.Messages;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MessagesRepository extends MongoRepository<Messages, ObjectId> {
}
