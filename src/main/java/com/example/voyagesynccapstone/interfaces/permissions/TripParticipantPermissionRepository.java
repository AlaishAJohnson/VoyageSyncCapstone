package com.example.voyagesynccapstone.interfaces.permissions;

import com.example.voyagesynccapstone.model.permissions.TripParticipantPermissions;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TripParticipantPermissionRepository extends MongoRepository<TripParticipantPermissions, ObjectId> {
    TripParticipantPermissions findByUserID(ObjectId userID);
    List<TripParticipantPermissions> findByUserIDIn(List<ObjectId> userIDs);
    List<TripParticipantPermissions> findByCanVoteOnItinerary(boolean canVoteOnItinerary);
    List<TripParticipantPermissions> findByCanCommunicateWithOrganizer(boolean canCommunicateWithOrganizer);
    List<TripParticipantPermissions> findByCanViewItinerary(boolean canViewItinerary);
    List<TripParticipantPermissions> findByCanJoinTrip(boolean canJoinTrip);
    List<TripParticipantPermissions> findByCanProvideFeedback(boolean canProvideFeedback);
}
