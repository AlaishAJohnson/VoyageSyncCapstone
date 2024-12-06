package com.voyagesync.voyagesyncproject.services.users;

import com.voyagesync.voyagesyncproject.enums.VerificationStatus;
import com.voyagesync.voyagesyncproject.models.users.TravelPreferences;
import com.voyagesync.voyagesyncproject.models.users.Users;
import com.voyagesync.voyagesyncproject.repositories.users.TravelPreferenceRepository;
import com.voyagesync.voyagesyncproject.repositories.users.UsersRepository;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class UsersService {

    private final UsersRepository usersRepository;
    private final TravelPreferenceRepository travelPreferenceRepository;

    public boolean isUserParticipant(String username) {
        Users user = usersRepository.findByUsername(username);
        return user != null && "participant".equals(user.getRole());  // Assuming role is a field in Users model
    }

    public UsersService(final UsersRepository usersRepository, final TravelPreferenceRepository travelPreferenceRepository) {
        this.usersRepository = usersRepository;
        this.travelPreferenceRepository = travelPreferenceRepository;
    }

    /* GET Methods */
    public List<Users> getAllUsers() {
        return usersRepository.findAll();
    }
    public List<Users> getByRole(final String role) {
        return usersRepository.findByRole(role);
    }

    public List<Users> getByFirstAndLastName(final String firstName, final String lastName) {
        return usersRepository.findByFirstNameAndLastName(firstName, lastName);
    }
    public List<Users> getByVerificationStatus(VerificationStatus verificationStatus) {
        return usersRepository.findByVerificationStatus(verificationStatus);
    }
    public Users getByUsername(String username){
        Users user = usersRepository.findByUsername(username);
        if(user != null) {
            return user;
        } else {
            throw new RuntimeException("User not found");
        }
    }
    public Users getByEmail(String email) {
        Users user = usersRepository.findByEmail(email);
        if(user != null) {
            return user;
        } else {
            throw new RuntimeException("User not found");
        }
    }
    public Users getByPhoneNumber(String phoneNumber) {
        Users user = usersRepository.findByPhoneNumber(phoneNumber);
        if(user != null) {
            return user;
        } else {
            throw new RuntimeException("User not found");
        }
    }
    public boolean existsById(ObjectId userId) {
        return usersRepository.existsById(userId);
    }

    public boolean existByUsername(String username) {
        return usersRepository.existsByUsername(username);
    }
    public boolean existByEmail(String email) {
        return usersRepository.existsByEmail(email);
    }
    public boolean existByPhoneNumber(String phoneNumber) {return usersRepository.existsByPhoneNumber(phoneNumber);}
    public Users login(String usernameOrEmail, String password) {
        Users user = usersRepository.findByUsername(usernameOrEmail);
        if (user == null) {
            user = usersRepository.findByEmail(usernameOrEmail);
        }
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        if(!Objects.equals(password, user.getPassword())) {
            throw new RuntimeException("Wrong password");
        }
        return user;
    }


    /* POST Methods */

    public Users createUser(Users user) {
        if(usersRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if(usersRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        if(usersRepository.existsByPhoneNumber(user.getPhoneNumber())) {
            throw new RuntimeException("Phone number already exists");
        }
        return usersRepository.save(user);
    }


    /* UPDATE METHODS */

    public void updateUser(Users user) {
        if (user.getId() == null || !usersRepository.existsById(user.getId())) {
            throw new IllegalArgumentException("User with given ID does not exist.");
        }
        // Ensure the user fields are updated and saved
        usersRepository.save(user);
    }

    public Optional<Users> findUserById(String id) {
        try {
            ObjectId objectId = new ObjectId(id);
            return usersRepository.findById(objectId);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public Users getUserById(String userId) {
        ObjectId userObjectId = new ObjectId(userId);
        return usersRepository.findById(userObjectId).orElse(null);
    }

    public Users linkTravelPreference(String userId, String preferencesId) {
        ObjectId userObjectId = new ObjectId(userId);
        Users user = usersRepository.findById(userObjectId).orElse(null);
        ObjectId preferenceObjectId = new ObjectId(preferencesId);
        TravelPreferences travelPreference = travelPreferenceRepository.findById(preferenceObjectId).orElse(null);
        if (travelPreference != null) {
            assert user != null;
            user.setTravelPreferences(travelPreference);
            return usersRepository.save(user);
        }
        return null;
    }
}