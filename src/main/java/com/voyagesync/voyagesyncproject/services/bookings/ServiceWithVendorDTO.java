package com.voyagesync.voyagesyncproject.services.bookings;

import lombok.Getter;
import lombok.Setter;
import org.bson.types.ObjectId;

@Setter
@Getter
public class ServiceWithVendorDTO {
    // Getters and setters for serviceId and vendorId now expect ObjectId
    @Setter
    @Getter
    private ObjectId serviceId;

    private String serviceName;

    private String serviceDescription;

    private Double price;

    @Setter
    @Getter
    private String vendorBusinessName;

    @Setter
    @Getter
    private ObjectId vendorId;

    private String location;

    @Setter
    @Getter
    private double averageRating;

    @Setter
    @Getter
    private String duration;

    @Setter
    @Getter
    private String typeOfService;

    @Setter
    @Getter
    private String timeFrame;
    @Getter
    @Setter
    private Integer openSlots;

}
