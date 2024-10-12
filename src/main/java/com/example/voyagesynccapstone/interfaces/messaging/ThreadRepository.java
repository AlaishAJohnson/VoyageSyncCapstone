package com.example.voyagesynccapstone.interfaces.messaging;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.example.voyagesynccapstone.model.messaging.Thread;
import org.springframework.stereotype.Repository;

@Repository
public interface ThreadRepository extends MongoRepository <Thread, ObjectId>{
}
