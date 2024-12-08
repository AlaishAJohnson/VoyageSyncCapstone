package com.voyagesync.voyagesyncproject.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServiceWithVendorDTO {

    private String serviceId;
    private String serviceName;
    private String serviceDescription;
    private Double price;
    private String vendorBusinessName;
    private String vendorId;
    private double averageRating;
    private double openSlots;

}
