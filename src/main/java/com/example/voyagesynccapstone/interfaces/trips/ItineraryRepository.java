package com.example.voyagesynccapstone.interfaces.trips;

import com.example.voyagesynccapstone.model.trips.Itinerary;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ItineraryRepository extends MongoRepository<Itinerary, ObjectId> {
    Itinerary findItineraryByTripID(ObjectId tripID);
    Itinerary findItineraryByItineraryID(List<ObjectId> itineraryID);
    List<Itinerary> findByDateOfService(LocalDate dateOfService);
    List<Itinerary> findByDateOfServiceBetween(LocalDate startDate, LocalDate endDate);


}
