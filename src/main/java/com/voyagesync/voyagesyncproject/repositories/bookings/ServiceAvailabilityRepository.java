package com.voyagesync.voyagesyncproject.repositories.bookings;

import com.voyagesync.voyagesyncproject.models.bookings.ServiceAvailability;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ServiceAvailabilityRepository extends MongoRepository<ServiceAvailability, ObjectId> {
    List<ServiceAvailability> findByServiceIdAndDateOfService(ObjectId serviceId, LocalDate dateOfService);
    List<ServiceAvailability> findByServiceId(List<ObjectId> serviceId);
    void deleteByServiceId(ObjectId serviceId);

    Optional<ServiceAvailability> findById(String id);


    List<ServiceAvailability> findByServiceIdIn(List<ObjectId> serviceIds);

//    public List<ServiceAvailability> findByServiceIdIn(List<ObjectId> serviceIds);


    // List<ServiceAvailability> findByIsAvailable(boolean isAvailable);
    // List<ServiceAvailability> findServiceAvailabilityIn(List<ObjectId> serviceAvailabilityIds);
    // List<ServiceAvailability> findByServiceIdIn(List<ObjectId> serviceIds);
}
