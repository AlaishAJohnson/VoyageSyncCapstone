package com.voyagesync.voyagesyncproject.services.permissions;

import com.voyagesync.voyagesyncproject.models.permissions.AdminPermissions;
import com.voyagesync.voyagesyncproject.repositories.permissions.AdminPermissionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminPermissionService {

    private final AdminPermissionRepository adminPermissionRepository;
    public AdminPermissionService(final AdminPermissionRepository adminPermissionRepository) {
        this.adminPermissionRepository = adminPermissionRepository;
    }

    public List<AdminPermissions> getAllAdminPermissions() {
        return adminPermissionRepository.findAll();
    }
}
