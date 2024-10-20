package com.voyagesync.voyagesyncproject.services.permissions;

import com.voyagesync.voyagesyncproject.models.permissions.OrganizerPermissions;
import com.voyagesync.voyagesyncproject.repositories.permissions.OrganizerPermissionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrganizerPermissionService {
    private final OrganizerPermissionRepository organizerPermissionRepository;
    public OrganizerPermissionService(final OrganizerPermissionRepository organizerPermissionRepository) {
        this.organizerPermissionRepository = organizerPermissionRepository;
    }

    public List<OrganizerPermissions> getAllOrganizerPermissions() {
        return organizerPermissionRepository.findAll();
    }
}
