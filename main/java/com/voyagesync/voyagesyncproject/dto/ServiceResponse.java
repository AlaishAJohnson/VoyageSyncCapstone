package com.voyagesync.voyagesyncproject.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServiceResponse {
    private String serviceId;
    private String serviceName;
    private String serviceDescription;
    private double price;
    private String vendorBusinessName;
    private double averageRating;
    private List<Map<String, Object>> serviceAvailability;
}
