package com.voyagesync.voyagesyncproject.models.bookings;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.TypeAlias;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

@Document(collection = "Services")
@TypeAlias("")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Services {
    @Id
    private ObjectId serviceId;

    @Field("vendorId")
    private ObjectId vendorId;

    private String serviceName;

    private String serviceDescription;

    private List<ServiceAvailability> serviceAvailability; // Store ObjectIds only

    private double price;

    private String location;

    // Convenience method to calculate available slots using ServiceAvailability (will be handled in the service layer)
    public int getAvailableSlots() {
        // Sum all available slots from serviceAvailability list (to be fetched manually from ServiceAvailability repository)
        return 0; // Placeholder - logic will be moved to ServicesService class
    }

    // A method to check if the service is available (will be handled in the service layer)
    public boolean isAvailable() {
        // Placeholder - logic will be moved to ServicesService class
        return false; // Placeholder
    }

    // Optional: Service details field
    private ServiceAvailability details;
}
