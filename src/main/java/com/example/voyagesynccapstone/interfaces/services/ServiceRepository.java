package com.example.voyagesynccapstone.interfaces.services;

import com.example.voyagesynccapstone.model.services.Services;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRepository extends MongoRepository<Services, ObjectId> {
    Services findByServiceID(ObjectId serviceID);
    List<Services> findByVendorID(ObjectId vendorID);
    List<Services> findByServiceType(String serviceType);
    List<Services> findByServicePrice(String servicePrice);
}
