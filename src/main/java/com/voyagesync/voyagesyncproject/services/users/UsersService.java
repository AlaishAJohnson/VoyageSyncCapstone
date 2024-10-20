package com.voyagesync.voyagesyncproject.services.users;

import com.voyagesync.voyagesyncproject.models.users.Users;
import com.voyagesync.voyagesyncproject.repositories.users.UsersRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UsersService {

    private final UsersRepository usersRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UsersService(final UsersRepository usersRepository) {
        this.usersRepository = usersRepository;
    }

    /* GET Methods */
    public List<Users> getAllUsers() {
        return usersRepository.findAll();
    }

    public boolean existByUsername(String username) {
        return usersRepository.findByUsername(username).isPresent();
    }
    public boolean existByEmail(String email) {
        return usersRepository.findByEmail(email).isPresent();
    }


    /* POST Methods */

    public Users createUser(Users user) {
        String hashedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashedPassword);
        user.setCreatedAt(LocalDateTime.now());
        return usersRepository.save(user);
    }

    /* UPDATE METHODS */

    public Users updateUser(Users user) {
        return usersRepository.save(user);
    }

}
