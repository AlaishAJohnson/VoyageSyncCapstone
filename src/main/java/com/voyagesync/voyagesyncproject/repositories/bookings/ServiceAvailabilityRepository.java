package com.voyagesync.voyagesyncproject.repositories.bookings;

import com.voyagesync.voyagesyncproject.models.bookings.ServiceAvailability;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ServiceAvailabilityRepository extends MongoRepository<ServiceAvailability, ObjectId> {
    //nonsense
    List<ServiceAvailability> findByIsAvailable(boolean isAvailable);
}
