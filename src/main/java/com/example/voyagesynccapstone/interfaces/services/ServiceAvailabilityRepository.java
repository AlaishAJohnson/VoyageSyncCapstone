package com.example.voyagesynccapstone.interfaces.services;

import com.example.voyagesynccapstone.model.services.ServiceAvailability;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface ServiceAvailabilityRepository extends MongoRepository<ServiceAvailability, ObjectId> {
    List<ServiceAvailability> findByServiceID(ObjectId serviceID);
    List<ServiceAvailability> findByDateOfService(LocalDate dateOfService);
    List<ServiceAvailability> findByTimeSlot(LocalTime timeSlot);
    List<ServiceAvailability> findByAvailableSlots(double availableSlot);
}
