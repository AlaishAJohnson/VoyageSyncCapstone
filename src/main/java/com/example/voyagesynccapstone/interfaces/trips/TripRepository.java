package com.example.voyagesynccapstone.interfaces.trips;

import com.example.voyagesynccapstone.model.trips.Trips;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TripRepository extends MongoRepository<Trips, ObjectId> {
    Trips findByTripID(ObjectId tripID);
    List<Trips> findByOrganizerID(ObjectId organizerID);
    List<Trips> findByTripStatus(Trips.TripStatus tripStatus);
    List<Trips> findByDestination(String destination);
}
