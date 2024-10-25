package com.voyagesync.voyagesyncproject.services.users;

import com.voyagesync.voyagesyncproject.models.users.Users;
import com.voyagesync.voyagesyncproject.repositories.users.UsersRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Service
public class UsersService {

    private final UsersRepository usersRepository;


    public UsersService(final UsersRepository usersRepository) {
        this.usersRepository = usersRepository;
    }

    /* GET Methods */
    public List<Users> getAllUsers() {
        return usersRepository.findAll();
    }
    public Users getByUsername(String username){
        return usersRepository.findByUsername(username);
    }

    public boolean existByUsername(String username) {
        return usersRepository.existsByUsername(username);
    }
    public boolean existByEmail(String email) {
        return usersRepository.existsByEmail(email);
    }
    public Users login(String usernameOrEmail, String password) {
        Users user = usersRepository.findByUsername(usernameOrEmail);
        if(user == null) {
            usersRepository.findByEmail(usernameOrEmail);
        }
        if(user == null) {
            throw new RuntimeException("User not found");
        }
        if(!Objects.equals(password, user.getPassword())) {
            throw new RuntimeException("Wrong password");
        }
        return user;
    }


    /* POST Methods */

    public Users createUser(Users user) {
//        String hashedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(user.getPassword());
        user.setCreatedAt(LocalDateTime.now());
        return usersRepository.save(user);
    }

    /* UPDATE METHODS */

    public Users updateUser(Users user) {
        return usersRepository.save(user);
    }

}
