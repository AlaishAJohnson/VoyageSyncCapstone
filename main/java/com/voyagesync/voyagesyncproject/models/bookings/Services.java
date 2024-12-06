package com.voyagesync.voyagesyncproject.models.bookings;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.TypeAlias;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "Services")
@TypeAlias("")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Services {

    @Id
    private ObjectId id;

    @Field("vendorId")
    private ObjectId vendorId;

    private String serviceName;

    private String serviceDescription;

    private Double price;

    @Field("location")
    private String location;

    // The details field now holds ServiceDetails objects with a timeFrame field as a string
    private List<ServiceDetails> details = new ArrayList<>(); // List of ServiceDetails objects

    // Convenience method to calculate available slots using the "details" field
    public int getAvailableSlots() {
        int totalAvailableSlots = 0;
        for (ServiceDetails detail : details) {
            totalAvailableSlots += detail.getOpenSlots(); // Add open slots from each service detail
        }
        return totalAvailableSlots;
    }

    // A method to check if the service is available based on the "details" field
    public boolean isAvailable() {
        return details != null && !details.isEmpty() && getAvailableSlots() > 0;
    }

    // Optional: Method to update available slots after a booking
    public void updateAvailableSlots(int slotsBooked) {
        for (ServiceDetails detail : details) {
            if (detail.getOpenSlots() >= slotsBooked) {
                detail.setOpenSlots(detail.getOpenSlots() - slotsBooked); // Reduce open slots by booked amount
                break;
            }
        }
    }

    // Optional: Add a method to add ServiceDetails to the service
    public void addServiceDetail(ServiceDetails serviceDetail) {
        this.details.add(serviceDetail);
    }
}
