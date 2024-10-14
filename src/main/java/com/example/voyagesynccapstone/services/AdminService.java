package com.example.voyagesynccapstone.services;

import com.example.voyagesynccapstone.interfaces.users.AdminRepository;
import com.example.voyagesynccapstone.model.users.Admins;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.List;
@Service
public class AdminService {
    @Autowired
    private AdminRepository adminRepository;

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
}
