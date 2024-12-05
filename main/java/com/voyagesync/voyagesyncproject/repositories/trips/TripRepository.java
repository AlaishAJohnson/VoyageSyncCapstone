package com.voyagesync.voyagesyncproject.repositories.trips;

import com.voyagesync.voyagesyncproject.models.trips.Trips;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TripRepository extends MongoRepository<Trips, ObjectId> {
    List<Trips> findByOrganizerId(ObjectId organizerId);
    List<Trips> findByOrganizerIdOrMemberIdsContaining(ObjectId organizerId, ObjectId memberId);
    List<Trips> findByMemberIds(ObjectId memberId);
    Trips findByTripId(ObjectId tripId);
}
