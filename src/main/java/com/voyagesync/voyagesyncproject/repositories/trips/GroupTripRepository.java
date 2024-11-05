package com.voyagesync.voyagesyncproject.repositories.trips;

import com.voyagesync.voyagesyncproject.models.trips.GroupTrips;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;


import java.util.List;

public interface GroupTripRepository extends MongoRepository<GroupTrips, ObjectId> {

//
//    List<GroupTrips> getAllGroupTripsContainingMemberId(ObjectId memberId);
//
//    List<GroupTrips> findByMembersContains(ObjectId memberId);
}
