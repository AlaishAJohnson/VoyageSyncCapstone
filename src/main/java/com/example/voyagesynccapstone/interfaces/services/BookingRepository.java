package com.example.voyagesynccapstone.interfaces.services;

import com.example.voyagesynccapstone.model.services.Bookings;
import com.example.voyagesynccapstone.enums.ConfirmationStatus;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends MongoRepository<Bookings, ObjectId> {
    Bookings findByBookingID(ObjectId bookingID);
    List<Bookings> findByVendorID(ObjectId vendorID);
    List<Bookings> findByServiceID(ObjectId serviceID);
    List<Bookings> findByUserID(ObjectId userID);
    List<Bookings> findByConfirmationStatus(ConfirmationStatus confirmationStatus);
}
