package com.voyagesync.voyagesyncproject.models.bookings;

import com.voyagesync.voyagesyncproject.enums.ConfirmationStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.TypeAlias;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalTime;

@Document(collection = "Bookings")
@TypeAlias("")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Bookings {
    @Id
    private ObjectId bookingId;
    private String serviceId;
    private String vendorId;
    private LocalDate bookingDate;
    private LocalTime bookingTime;
    private ConfirmationStatus confirmationStatus = ConfirmationStatus.PENDING;
    private String itineraryId;
}
