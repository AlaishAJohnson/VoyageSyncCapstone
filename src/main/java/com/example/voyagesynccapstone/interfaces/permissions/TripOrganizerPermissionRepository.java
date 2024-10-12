package com.example.voyagesynccapstone.interfaces.permissions;

import com.example.voyagesynccapstone.model.permissions.TripOrganizerPermissions;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TripOrganizerPermissionRepository extends MongoRepository<TripOrganizerPermissions, ObjectId> {
    TripOrganizerPermissions findByUserID(ObjectId userID);
    List<TripOrganizerPermissions> findByUserIDIn(List<ObjectId> userIDs);
    List<TripOrganizerPermissions> findByCanEditTrip(boolean canEditTrip);
    List<TripOrganizerPermissions> findByCanDeleteTrip(boolean canDeleteTrip);
    List<TripOrganizerPermissions> findByCanInviteParticipants(boolean canInviteParticipants);
    List<TripOrganizerPermissions> findByCanManageItinerary(boolean canManageItinerary);
    List<TripOrganizerPermissions> findByCanSuggestItinerary(boolean canSuggestItinerary);
    List<TripOrganizerPermissions> findByCanCommunicateWithParticipants(boolean canCommunicateWithParticipants);
    List<TripOrganizerPermissions> findByCanTransferRole(boolean canTransferRole);
}
