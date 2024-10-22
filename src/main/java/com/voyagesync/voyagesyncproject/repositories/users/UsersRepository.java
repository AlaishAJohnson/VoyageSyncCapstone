package com.voyagesync.voyagesyncproject.repositories.users;


import com.voyagesync.voyagesyncproject.models.users.Users;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsersRepository extends MongoRepository<Users, ObjectId> {
    Users findByUsername(String username);
    Users findByEmail(String email);

    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}
