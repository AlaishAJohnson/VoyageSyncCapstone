package com.voyagesync.voyagesyncproject.services.permissions;

import com.voyagesync.voyagesyncproject.models.permissions.ParticipantPermissions;
import com.voyagesync.voyagesyncproject.repositories.permissions.ParticipantPermissionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ParticipantPermissionService {
    private final ParticipantPermissionRepository participantPermissionRepository;
    public ParticipantPermissionService(final ParticipantPermissionRepository participantPermissionRepository) {
        this.participantPermissionRepository = participantPermissionRepository;
    }

    public List<ParticipantPermissions> getAllParticipantPermissions() {
        return participantPermissionRepository.findAll();
    }
}
