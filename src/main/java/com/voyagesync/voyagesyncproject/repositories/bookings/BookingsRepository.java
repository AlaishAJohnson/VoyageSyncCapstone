package com.voyagesync.voyagesyncproject.repositories.bookings;

import com.voyagesync.voyagesyncproject.enums.ConfirmationStatus;
import com.voyagesync.voyagesyncproject.models.bookings.Bookings;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingsRepository extends MongoRepository<Bookings, ObjectId> {
    List<Bookings> findByConfirmationStatus(ConfirmationStatus confirmationStatus);
    List<Bookings> findByBookingDate(LocalDate bookingDate);
    List<Bookings> findByNumberOfParticipants(int numberOfParticipants);
}
