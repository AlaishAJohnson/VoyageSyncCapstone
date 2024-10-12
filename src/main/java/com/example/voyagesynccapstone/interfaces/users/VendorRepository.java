package com.example.voyagesynccapstone.interfaces;

import com.example.voyagesynccapstone.enums.VerificationStatus;
import com.example.voyagesynccapstone.model.users.Vendors;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VendorRepository extends MongoRepository<Vendors, ObjectId> {

    Vendors findByVendorID(ObjectId vendorID);
    Vendors findByVendorName(String vendorName);
    List<Vendors> findByCountryOfRegistration(String countryOfRegistration);
    List<Vendors> findByVerificationStatus(VerificationStatus verificationStatus);
    void deleteByVendorID(ObjectId vendorID);


}
