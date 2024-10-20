package com.voyagesync.voyagesyncproject.repositories.bookings;

import com.voyagesync.voyagesyncproject.models.bookings.Bookings;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingsRepository extends MongoRepository<Bookings, ObjectId> {
}
