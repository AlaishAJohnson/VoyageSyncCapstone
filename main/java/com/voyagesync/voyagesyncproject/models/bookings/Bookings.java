package com.voyagesync.voyagesyncproject.models.bookings;

import com.voyagesync.voyagesyncproject.enums.ConfirmationStatus;
import lombok.*;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
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
    private ObjectId serviceId;
    private String vendorId;
    private LocalDate bookingDate;
    private LocalTime bookingTime;
    private ConfirmationStatus confirmationStatus = ConfirmationStatus.PENDING;
    private String itineraryId;
    @Setter
    @Getter
    @Transient
    private String serviceName;

    // getter for numberOfParticipants
    @Setter
    @Getter
    private int numberOfParticipants;

}
