package com.example.voyagesynccapstone.services;

import com.example.voyagesynccapstone.interfaces.permissions.TripOrganizerPermissionRepository;
import com.example.voyagesynccapstone.model.permissions.TripOrganizerPermissions;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TripOrganizerService {

    @Autowired
    private TripOrganizerPermissionRepository tripOrganizerPermissionRepository;

    public TripOrganizerPermissions getPermissionsByUserId(ObjectId userID) {
        return tripOrganizerPermissionRepository.findByUserID(userID);
    }

    public void assignPermissions(ObjectId userID, boolean canEditTrip, boolean canDeleteTrip, boolean canInviteParticipants,
                                  boolean canManageItinerary, boolean canSuggestItinerary,
                                  boolean canCommunicateWithParticipants, boolean canTransferRole) {
        TripOrganizerPermissions permissions = new TripOrganizerPermissions();
        permissions.setUserID(userID);
        permissions.setCanEditTrip(canEditTrip);
        permissions.setCanDeleteTrip(canDeleteTrip);
        permissions.setCanInviteParticipants(canInviteParticipants);
        permissions.setCanManageItinerary(canManageItinerary);
        permissions.setCanSuggestItinerary(canSuggestItinerary);
        permissions.setCanCommunicateWithParticipants(canCommunicateWithParticipants);
        permissions.setCanTransferRole(canTransferRole);
        tripOrganizerPermissionRepository.save(permissions);
    }

    public List<TripOrganizerPermissions> getAllPermissions() {
        return tripOrganizerPermissionRepository.findAll();
    }

    public List<TripOrganizerPermissions> getByManageItinerary(boolean canManage) {
        return tripOrganizerPermissionRepository.findByCanManageItinerary(canManage);
    }

    public List<TripOrganizerPermissions> getBySuggestItinerary(boolean canSuggest) {
        return tripOrganizerPermissionRepository.findByCanSuggestItinerary(canSuggest);
    }

    public List<TripOrganizerPermissions> getByCommunicateWithParticipants(boolean canCommunicate) {
        return tripOrganizerPermissionRepository.findByCanCommunicateWithParticipants(canCommunicate);
    }

    public List<TripOrganizerPermissions> getByTransferRole(boolean canTransfer) {
        return tripOrganizerPermissionRepository.findByCanTransferRole(canTransfer);
    }
}
