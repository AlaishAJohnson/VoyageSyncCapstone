package com.voyagesync.voyagesyncproject.repositories.bookings;

import com.voyagesync.voyagesyncproject.models.bookings.Services;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRepository extends MongoRepository<Services, ObjectId> {

    List<Services> findByServiceIdIn(List<ObjectId> serviceIds);

    List<Services> findByLocation(String location);

    List<Services> findByPrice(double price);

    @Query("{ 'vendorId': ?0 }")
    List<Services> findByVendorId(ObjectId vendorId);

    // Method to find services based on availability (customize the query as needed)
    @Query("{ 'serviceAvailability.serviceAvailabilityId': { $in: ?0 } }")
    List<Services> findByServiceAvailability(List<ObjectId> serviceAvailabilityIds);
}
