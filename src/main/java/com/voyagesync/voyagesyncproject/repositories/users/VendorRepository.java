package com.voyagesync.voyagesyncproject.repositories.users;

import com.voyagesync.voyagesyncproject.models.users.Vendors;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface VendorRepository extends MongoRepository<Vendors, ObjectId> {
    // Method to find vendors by business name
    List<Vendors> findByBusinessName(String businessName);

    // Method to find vendors by business type
    List<Vendors> findByBusinessType(String businessType);
}
