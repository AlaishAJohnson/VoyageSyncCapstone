package com.example.voyagesynccapstone.interfaces.messaging;

import com.example.voyagesynccapstone.model.messaging.GroupMessages;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupMessageRepository extends MongoRepository<GroupMessages, ObjectId> {

    List<GroupMessages> findByGroupTripID(ObjectId groupTripID);
    List<GroupMessages> findByThreadID(ObjectId threadID);
    List<GroupMessages> findByMessageID(ObjectId messageID);
}
