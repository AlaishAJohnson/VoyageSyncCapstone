package com.example.voyagesynccapstone.interfaces.services;

import com.example.voyagesynccapstone.model.services.Bookings;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingRepository extends MongoRepository<Bookings, ObjectId> {
}
