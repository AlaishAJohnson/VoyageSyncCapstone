package com.example.voyagesynccapstone.services;

import com.example.voyagesynccapstone.interfaces.permissions.PermissionRepository;
import com.example.voyagesynccapstone.interfaces.users.AdminRepository;
import com.example.voyagesynccapstone.model.permissions.Permissions;
import com.example.voyagesynccapstone.model.users.Admins;
import com.example.voyagesynccapstone.services.exceptions.ResourceNotFoundException;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {
    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PermissionRepository permissionRepository;  // Add the PermissionRepository

    public List<Admins> getAllAdmins() {
        return adminRepository.findAll();
    }

    public Admins getAdminById(ObjectId adminId) {
        return adminRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found with id " + adminId));
    }

    public Admins createAdmin(Admins admin) {
        return adminRepository.save(admin);
    }

    public void deleteAdmin(ObjectId adminId) {
        adminRepository.deleteById(adminId);
    }

    // New method to assign permission
    public void assignPermission(ObjectId adminId, ObjectId permissionId) {
        Admins admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found with id " + adminId));

        Permissions permission = permissionRepository.findById(permissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Permission not found with id " + permissionId));

        admin.setPermissionID(permissionId);  // Assuming you have this field in Admins model
        adminRepository.save(admin);
    }
}
