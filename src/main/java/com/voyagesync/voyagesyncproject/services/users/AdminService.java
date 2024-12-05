package com.voyagesync.voyagesyncproject.services.users;

import com.voyagesync.voyagesyncproject.enums.VerificationStatus;
import com.voyagesync.voyagesyncproject.models.users.Admins;
import com.voyagesync.voyagesyncproject.models.users.Users;
import com.voyagesync.voyagesyncproject.repositories.users.AdminRepository;
import com.voyagesync.voyagesyncproject.repositories.users.UsersRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import org.bson.types.ObjectId;

@Service
public class AdminService {
    private final AdminRepository adminRepository;
    private final UsersRepository userRepository; 

    public AdminService(final AdminRepository adminRepository, final UsersRepository userRepository) {
        this.adminRepository = adminRepository;
        this.userRepository = userRepository;
    }

    public List<Admins> getAllAdmins() {
        return adminRepository.findAll();
    }

    public void createAdmin(final Admins admin) {
        adminRepository.save(admin);
    }

    public Users updateUserVerificationStatus(ObjectId userId, VerificationStatus newStatus) throws IllegalArgumentException {
        if (newStatus != VerificationStatus.PENDING && 
        newStatus != VerificationStatus.REJECTED && 
        newStatus != VerificationStatus.VERIFIED) {
        throw new IllegalArgumentException("Invalid verification status");
    }

        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        user.setVerificationStatus(newStatus);
        return userRepository.save(user);
    }

    public void deleteUser(ObjectId userId) throws IllegalArgumentException {
        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        userRepository.deleteById(userId);
    }
}
