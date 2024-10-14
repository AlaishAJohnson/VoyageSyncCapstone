package com.example.voyagesynccapstone.services;

import com.example.voyagesynccapstone.interfaces.permissions.PermissionRepository;
import com.example.voyagesynccapstone.model.permissions.Permissions;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDateTime;
import java.util.List;

public class PermissionService {
    @Autowired
    private PermissionRepository permissionRepository;

    // Get all permissions
    public List<Permissions> getAllPermissions() {
        return permissionRepository.findAll();
    }

    // Create a new permission
    public Permissions createPermission(String permissionName, ObjectId userID) {
        Permissions permission = new Permissions();
        permission.setPermissionName(permissionName);
        permission.setUserID(userID);
        permission.setDateAssigned(LocalDateTime.now());
        return permissionRepository.save(permission);
    }
}
