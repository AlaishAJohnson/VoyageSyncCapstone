package com.example.voyagesynccapstone.services;

import com.example.voyagesynccapstone.enums.VerificationStatus;
import com.example.voyagesynccapstone.interfaces.users.UserRepository;
import com.example.voyagesynccapstone.model.users.Users;
import com.example.voyagesynccapstone.services.exceptions.ResourceNotFoundException;
import org.bson.types.ObjectId;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<Users> getAllUsers() {
        return userRepository.findAll();
    }

    public Users getUserById(ObjectId userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + userId));
    }

    public Users getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Users createUser(Users user) {
        return userRepository.save(user);
    }

    public void deleteUser(ObjectId userId) {
        userRepository.deleteUsersByUserID(userId);
    }

    public List<Users> findUsersByRole(String role) {
        return userRepository.findByRole(role);
    }

    public List<Users> findUsersByVerificationStatus(VerificationStatus verificationStatus) {
        return userRepository.findByVerificationStatus(verificationStatus);
    }
}
