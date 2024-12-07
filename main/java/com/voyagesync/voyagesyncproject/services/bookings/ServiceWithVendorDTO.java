package com.voyagesync.voyagesyncproject.services.bookings;

import com.fasterxml.jackson.annotation.JsonValue;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
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

    @Setter
    @Getter
    private ObjectId vendorId;

    private String serviceName;

    private String serviceDescription;

    private Double price;

    @Setter
    @Getter
    private String vendorBusinessName;

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


    public String getServiceIdAsString() {
        return serviceId != null ? serviceId.toHexString() : null;
    }

    public String getVendorIdAsString() {
        return vendorId != null ? vendorId.toHexString() : null;
    }

}
