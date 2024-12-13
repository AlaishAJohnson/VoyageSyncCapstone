package com.voyagesync.voyagesyncproject.models.trips;

import com.voyagesync.voyagesyncproject.enums.ConfirmationStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "Itinerary")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Itinerary{
    @Id
    private ObjectId itineraryId;
    private ObjectId serviceId;
    private LocalDate dateOfService;
    private LocalTime timeOfService;
    private ConfirmationStatus confirmationStatus = ConfirmationStatus.PENDING;
    private double voteCount;
    private ObjectId creatorId;
    private ObjectId tripId;

    private List<ObjectId> votes = new ArrayList<>();
    private ObjectId bookingId;

}
