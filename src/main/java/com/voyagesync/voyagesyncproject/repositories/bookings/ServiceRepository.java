package com.voyagesync.voyagesyncproject.repositories.bookings;

import com.voyagesync.voyagesyncproject.models.bookings.Services;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ServiceRepository extends MongoRepository<Services, ObjectId> {
}
