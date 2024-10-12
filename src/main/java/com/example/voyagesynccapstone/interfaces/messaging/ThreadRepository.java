package com.example.voyagesynccapstone.interfaces.messaging;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.example.voyagesynccapstone.model.messaging.Thread;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ThreadRepository extends MongoRepository <Thread, ObjectId>{
    List<Thread> findParticipantByParticipants(List<ObjectId> participantID);
    List<Thread> findByThreadType(Thread.ThreadType threadType);
    Thread findByThreadID(ObjectId threadID);
}
