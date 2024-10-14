package com.example.voyagesynccapstone.model.trips;

import com.mongodb.lang.Nullable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Document(collection = "trips")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Trips {

    @Id
    private ObjectId tripID;
    private ObjectId organizerID; // reference
    private String tripName;
    private String destination;
    private LocalDate startDate;
    private LocalDate endDate;
    private double budget;
    private Map<String, List<ObjectId>> itinerary;
    @Nullable private ObjectId groupTripID;
    private TripStatus tripStatus = TripStatus.PROGRESS;
    
    public enum TripStatus {
        PROGRESS,
        COMPLETED,
        UPCOMING,
        CANCELLED
    }

}
