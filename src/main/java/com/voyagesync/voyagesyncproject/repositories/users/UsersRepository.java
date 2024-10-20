package com.voyagesync.voyagesyncproject.repositories.users;


import com.voyagesync.voyagesyncproject.models.users.Users;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsersRepository extends MongoRepository<Users, ObjectId> {
    Optional<Users> findByUsername(String username);
    Optional<Users> findByEmail(String email);
}
