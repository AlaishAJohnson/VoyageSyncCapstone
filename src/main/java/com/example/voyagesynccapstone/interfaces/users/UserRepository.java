package com.example.voyagesynccapstone.interfaces.users;


import com.example.voyagesynccapstone.enums.VerificationStatus;
import com.example.voyagesynccapstone.model.users.Users;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends MongoRepository <Users, ObjectId> {
    Users findByEmail(String email); // method to find by email
    Users findByUserID (ObjectId userID); // method to find by userID
    Users findByPhoneNumber (String phoneNumber); // method to find by phoneNUmber
    List<Users> findByRole(String role); // method to find by role
    List<Users> findByTravelPreference_Activities(String activity);
    List<Users> findByTravelPreference_Weather(String weather);
    List<Users> findByTravelPreference_Food(String food);
    List<Users> findByVerificationStatus (VerificationStatus verificationStatus);
    void deleteUsersByUserID (ObjectId userID);
}
