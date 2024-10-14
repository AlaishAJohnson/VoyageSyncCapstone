package com.example.voyagesynccapstone.services;

import com.example.voyagesynccapstone.interfaces.permissions.TripParticipantPermissionRepository;
import com.example.voyagesynccapstone.interfaces.users.UserRepository;
import com.example.voyagesynccapstone.model.permissions.TripParticipantPermissions;
import com.example.voyagesynccapstone.services.exceptions.ResourceNotFoundException;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TripParticipantService {
    @Autowired
    private TripParticipantPermissionRepository tripParticipantPermissionRepository;

    @Autowired
    private UserRepository userRepository;

    public List<TripParticipantPermissions> getAllPermissions() {
        return tripParticipantPermissionRepository.findAll();
    }

    public TripParticipantPermissions getPermissionByUserId(ObjectId userId) {
        return tripParticipantPermissionRepository.findByUserID(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Permissions not found for user ID " + userId));
    }

    public TripParticipantPermissions createPermission(TripParticipantPermissions permissions) {
        return tripParticipantPermissionRepository.save(permissions);
    }

    public void deletePermission(ObjectId userId) {
        TripParticipantPermissions permissions = getPermissionByUserId(userId);
        tripParticipantPermissionRepository.delete(permissions);
    }
}
