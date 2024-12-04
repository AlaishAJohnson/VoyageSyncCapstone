package com.voyagesync.voyagesyncproject.models.bookings;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.TypeAlias;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalTime;

@Document(collection = "Service-Availability")
@TypeAlias("")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServiceAvailability {
    @Id
    private String id;
    @Getter
    private ObjectId serviceId;

    private ObjectId serviceAvailabilityId;

    public ObjectId getServiceAvailabilityId() {
        return serviceAvailabilityId;
    }

    private LocalDate dateOfService;
    private LocalTime timeOfService;
    private boolean isAvailable = true;
    private int availableSlots;

}
