package com.voyagesync.voyagesyncproject.repositories.bookings;

import com.voyagesync.voyagesyncproject.models.bookings.Services;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRepository extends MongoRepository<Services, String> {

    List<Services> findByIdIn(List<ObjectId> ids);

    List<Services> findByLocation(String location);

    List<Services> findByPrice(Double price);

    @Query("{ 'vendorId': ?0 }")
    List<Services> findByVendorId(ObjectId vendorId);

    // Custom query to find services based on the details field (if necessary)
    @Query("{ 'details.start': { $gte: ?0 }, 'details.end': { $lte: ?1 } }")
    List<Services> findByDetailsBetween(String startDate, String endDate);
}
