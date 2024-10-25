package com.voyagesync.voyagesyncproject.repositories.users;


import com.voyagesync.voyagesyncproject.enums.VerificationStatus;
import com.voyagesync.voyagesyncproject.models.users.Users;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UsersRepository extends MongoRepository<Users, ObjectId> {
    Users findByUsername(String username);
    Users findByEmail(String email);
    Users findByPhoneNumber(String phoneNumber);
    List<Users> findByRole(String role);
    List<Users> findByFirstNameAndLastName(String firstName, String lastName);
    List<Users> findByVerificationStatus(VerificationStatus verificationStatus);

    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}
