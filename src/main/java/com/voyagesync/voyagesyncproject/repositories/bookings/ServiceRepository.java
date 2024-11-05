package com.voyagesync.voyagesyncproject.repositories.bookings;

import com.voyagesync.voyagesyncproject.models.bookings.Services;
import com.voyagesync.voyagesyncproject.models.bookings.ServiceAvailability; //Remove
import com.voyagesync.voyagesyncproject.models.users.Users;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface ServiceRepository extends MongoRepository<Services, ObjectId> {
    List<Services> findByServiceIdIn(List<ObjectId> serviceIds);

    List<Services> getByLocation(String location);
    List<Services> getByPrice(double price);

    //doesnt run
    List<Services> getByServiceAvailability(List<ObjectId> serviceAvailabilityIds);
    //List<Services> getByDateOfService(LocalDate dateOfService);
    //List<Services> getByDateTime(LocalDate dateOfService, LocalTime timeOfService);

    //Location, price, availability, date, date/time
}
