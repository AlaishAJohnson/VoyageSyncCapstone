package com.voyagesync.voyagesyncproject.services.permissions;

import com.voyagesync.voyagesyncproject.models.permissions.UserPermissions;
import com.voyagesync.voyagesyncproject.repositories.permissions.UserPermissionsRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserPermissionService {
    private final UserPermissionsRepository userPermissionsRepository;
    public UserPermissionService(final UserPermissionsRepository userPermissionsRepository) {
        this.userPermissionsRepository = userPermissionsRepository;
    }

    public List<UserPermissions> getAllUserPermissions() {
        return userPermissionsRepository.findAll();
    }
}
