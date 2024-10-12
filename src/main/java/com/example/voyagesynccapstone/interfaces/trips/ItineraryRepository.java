package com.example.voyagesynccapstone.interfaces.trips;

import com.example.voyagesynccapstone.model.trips.Itinerary;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItineraryRepository extends MongoRepository<Itinerary, ObjectId> {
}
