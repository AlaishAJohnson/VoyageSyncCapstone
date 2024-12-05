package com.voyagesync.voyagesyncproject.repositories.users;

import com.voyagesync.voyagesyncproject.models.users.Admins;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminRepository extends MongoRepository<Admins, ObjectId> {
}
