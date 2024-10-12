package com.example.voyagesynccapstone.interfaces.services;

import com.example.voyagesynccapstone.model.services.Services;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ServiceRepository extends MongoRepository<Services, ObjectId> {
}
