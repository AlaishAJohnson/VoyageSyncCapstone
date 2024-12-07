package com.voyagesync.voyagesyncproject.repositories.messaging;

import com.voyagesync.voyagesyncproject.models.messaging.Messages;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessagesRepository extends MongoRepository<Messages, ObjectId> {

    @Query("{ 'ObjectId': ?0 }")
    List<Messages> findByTripId(String tripId);
}
