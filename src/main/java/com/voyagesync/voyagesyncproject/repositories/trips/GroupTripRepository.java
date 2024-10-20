package com.voyagesync.voyagesyncproject.repositories.trips;

import com.voyagesync.voyagesyncproject.models.trips.GroupTrips;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface GroupTripRepository extends MongoRepository<GroupTrips, ObjectId> {
}
