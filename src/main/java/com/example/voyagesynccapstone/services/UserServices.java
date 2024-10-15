package com.example.voyagesynccapstone.services;

import com.example.voyagesynccapstone.interfaces.users.UserRepository;
import com.example.voyagesynccapstone.model.users.Users;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServices {

    private final UserRepository userRepository;

    public UserServices(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // CRUD
    public Users addUser(Users user) { // create user
        return userRepository.save(user);
    }



}
