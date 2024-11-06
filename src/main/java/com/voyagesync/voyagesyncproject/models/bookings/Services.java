package com.voyagesync.voyagesyncproject.models.bookings;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.TypeAlias;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document(collection = "Services")
@TypeAlias("")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Services {
    @Id
    private ObjectId serviceId;
    private String serviceName;
    private String serviceDescription;
    @DBRef
    private List<ServiceAvailability> serviceAvailability; // Changed to hold ServiceAvailability objects
    private double price;

    private String location;

    // Add a convenience method to get available slots from associated ServiceAvailability
    public int getAvailableSlots() {
        // Sum all available slots from serviceAvailability list
        return serviceAvailability.stream()
                .mapToInt(ServiceAvailability::getAvailableSlots)
                .sum();
    }

    // a method to check if the service is available
    public boolean isAvailable() {
        // Check if there is at least one availability with isAvailable set to true
        return serviceAvailability.stream()
                .anyMatch(ServiceAvailability::isAvailable);
    }
    private ServiceAvailability details;
}
