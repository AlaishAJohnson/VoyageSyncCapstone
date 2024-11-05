package com.voyagesync.voyagesyncproject.repositories.bookings;

import com.voyagesync.voyagesyncproject.models.bookings.ServiceAvailability;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ServiceAvailabilityRepository extends MongoRepository<ServiceAvailability, ObjectId> {
    List<ServiceAvailability> findByServiceIdAndDateOfService(ObjectId serviceId, LocalDate dateOfService);
//    List<ServiceAvailability> findServiceAvailabilityIn(List<ObjectId> serviceAvailabilityIds);
//    List<ServiceAvailability> findByServiceIdIn(List<ObjectId> serviceIds);
    List<ServiceAvailability> findByServiceId(ObjectId serviceId);

    //List<ServiceAvailability> findByIsAvailable(boolean isAvailable);
}
