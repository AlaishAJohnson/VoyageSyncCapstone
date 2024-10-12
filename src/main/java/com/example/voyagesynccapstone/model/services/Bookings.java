package com.example.voyagesynccapstone.model.services;

import com.example.voyagesynccapstone.enums.ConfirmationStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalTime;

@Document(collection = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Bookings {

    @Id
    private ObjectId bookingId;
    private LocalDate dateOfBooking;
    private LocalTime timeOfBooking;
    private ConfirmationStatus confirmationStatus = ConfirmationStatus.PENDING;

    // References
    private ObjectId vendorID;
    private ObjectId serviceID;
    private ObjectId userID; // reference to trip organizer

}
