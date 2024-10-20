package com.voyagesync.voyagesyncproject.repositories.users;

import com.voyagesync.voyagesyncproject.models.users.Vendors;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface VendorRepository extends MongoRepository<Vendors, ObjectId> {
}
