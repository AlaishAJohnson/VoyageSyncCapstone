package com.example.voyagesynccapstone.model;

import com.mongodb.lang.Nullable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
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
    private String tripID;
    private String organizerID;
    private String tripName;
    private String destination;
    private LocalDate startDate;
    private LocalDate endDate;
    private double budget;
    private Map<String, List<String>> itinerary;
    @Nullable private String groupTripID;
    private TripStatus tripStatus = TripStatus.PROGRESS;
    
    public enum TripStatus {
        PROGRESS,
        COMPLETED,
        UPCOMING,
        CANCELLED
    }


}
