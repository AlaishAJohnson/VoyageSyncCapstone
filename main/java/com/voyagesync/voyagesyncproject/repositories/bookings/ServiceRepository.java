package com.voyagesync.voyagesyncproject.repositories.bookings;

import com.voyagesync.voyagesyncproject.models.bookings.Services;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ServiceRepository extends MongoRepository<Services, ObjectId> {

    // Find services by a list of IDs
    List<Services> findByIdIn(List<ObjectId> ids);

//    // Find services by location
//    List<Services> findByLocation(String location);
//
//    // Find services by price
//    List<Services> findByPrice(Double price);

    // Find services by vendorId
    @Query("{ 'vendorId': ?0 }")
    List<Services> findByVendorId(ObjectId vendorId);


    @Query("{ 'timeFrame': ?0 }")
    List<Services> findByTimeFrame(String timeFrame);

    // Find services by open slots
    List<Services> findByOpenSlotsGreaterThanEqual(Integer openSlots);

    Optional<Services> findById(ObjectId serviceId);
}
