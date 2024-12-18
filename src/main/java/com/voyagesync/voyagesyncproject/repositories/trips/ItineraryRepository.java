package com.voyagesync.voyagesyncproject.repositories.trips;

import com.voyagesync.voyagesyncproject.models.trips.Itinerary;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItineraryRepository extends MongoRepository<Itinerary, ObjectId> {
    Itinerary findByItineraryId(ObjectId itineraryId);
    List<Itinerary> findByTripIdAndCreatorId(ObjectId tripId, ObjectId creatorId);
    List<Itinerary> findByTripId(ObjectId tripId);
}
