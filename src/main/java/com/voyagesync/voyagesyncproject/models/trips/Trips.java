package com.voyagesync.voyagesyncproject.models.trips;

import com.mongodb.lang.Nullable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.util.List;

@Document(collection = "Trip")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Trips {
    @Id
    private ObjectId tripId;
    private ObjectId organizerId;
    private String tripName;
    private String destination;
    private LocalDate startDate;
    private LocalDate endDate;
    private double budget;
    private List<ObjectId> itinerary;


    private boolean isGroupTrip;
    @Nullable
    private ObjectId groupTripId;
    private TripStatus tripStatus = TripStatus.PROGRESS;


    public boolean isGroupTrip() {
        return isGroupTrip;
    }

    public void setIsGroupTrip(boolean isGroupTrip) {
        this.isGroupTrip = isGroupTrip;
    }

    public enum TripStatus {
        PROGRESS,
        COMPLETED,
        UPCOMING,
        CANCELLED
    }
}
