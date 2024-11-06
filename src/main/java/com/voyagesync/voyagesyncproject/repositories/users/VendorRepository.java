package com.voyagesync.voyagesyncproject.repositories.users;

import com.voyagesync.voyagesyncproject.models.users.Vendors;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface VendorRepository extends MongoRepository<Vendors, ObjectId> {
    List<Vendors> findVendorByVendorId(final ObjectId id);

    List<Vendors> findByBusinessName(String businessName);
    List<Vendors> findByIndustry(String industry);
    // Method to find vendors by business type
    List<Vendors> findByBusinessType(String businessType);
    // a method to find vendors that offer a specific service
    List<Vendors> findByServicesContaining(ObjectId serviceId);
}
