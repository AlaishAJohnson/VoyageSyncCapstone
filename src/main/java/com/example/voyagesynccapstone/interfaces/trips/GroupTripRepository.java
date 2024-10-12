package com.example.voyagesynccapstone.interfaces.trips;

import com.example.voyagesynccapstone.model.trips.GroupTrips;
import com.example.voyagesynccapstone.model.trips.Trips;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupTripRepository extends MongoRepository<GroupTrips, ObjectId> {
    GroupTrips findByGroupTripID(ObjectId groupTripID);
    List<GroupTrips> findByOrganizerID(ObjectId organizerID);
    List<GroupTrips> findByTripStatus(Trips.TripStatus tripStatus);
    List<GroupTrips> findByTripStatusAndOrganizerID(Trips.TripStatus tripStatus, ObjectId organizerID);
    List<GroupTrips> findByDestination(String destination);

    @Query("{ '$or': [ { 'memberIDs.Participant': ?0 }, { 'memberIDs.Organizer': ?0 } ] }") // custom query for Find member id
    List<GroupTrips> findByMemberID(ObjectId memberID);

    @Query("{ 'memberIDs.Participant': ?0 }")
    List<GroupTrips> findByParticipantId(ObjectId userID);

}
