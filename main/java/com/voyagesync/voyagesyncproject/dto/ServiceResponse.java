package com.voyagesync.voyagesyncproject.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServiceResponse {
    private ObjectId serviceId;
    private String serviceName;
    private String serviceDescription;
    private double price;
    private ObjectId vendorId;
    private List<ObjectId> serviceAvailability;
}
