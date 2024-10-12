package com.example.voyagesynccapstone.interfaces.trips;

import com.example.voyagesynccapstone.model.trips.Trips;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TripRepository extends MongoRepository<Trips, ObjectId> {

}
