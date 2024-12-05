package com.voyagesync.voyagesyncproject.models.trips;

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

@Document(collection = "Itinerary")
@TypeAlias("")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Itinerary{
    @Id
    private ObjectId itineraryId;
    private String nameOfService;
    private LocalDate dateOfService;
    private LocalTime timeOfService;
    private ConfirmationStatus confirmationStatus = ConfirmationStatus.PENDING;
    private double voteCount;

    private ObjectId bookingId;
}
