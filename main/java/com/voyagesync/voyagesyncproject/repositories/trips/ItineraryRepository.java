package com.voyagesync.voyagesyncproject.repositories.trips;

import com.voyagesync.voyagesyncproject.models.trips.Itinerary;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItineraryRepository extends MongoRepository<Itinerary, ObjectId> {
}
