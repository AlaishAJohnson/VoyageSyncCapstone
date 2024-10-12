package com.example.voyagesynccapstone.model.trips;

import com.example.voyagesynccapstone.enums.ConfirmationStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalTime;

@Document(collection = "itinerary")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Itinerary {

    @Id
    private ObjectId itineraryID;
    private LocalDate dateOfService;
    private LocalTime timeOfService;
    private ConfirmationStatus confirmationStatus = ConfirmationStatus.PENDING;
    private double voteCount;

    // References
    private ObjectId tripID;
    private ObjectId serviceID;

}
