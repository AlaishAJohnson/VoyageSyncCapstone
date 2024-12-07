package com.voyagesync.voyagesyncproject.services.bookings;

import com.voyagesync.voyagesyncproject.models.bookings.ServiceDetails;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class ServiceWithVendorDTO {

    private String serviceId;
    private String serviceName;
    private String serviceDescription;
    private Double price;
    private String vendorBusinessName;
    private String vendorId;
    private String location;
    private double averageRating;
    private List<ServiceDetails> details; // Updated to reflect the ServiceDetails model directly

    // Getters and Setters

    public String getServiceId() {
        return serviceId;
    }

    public void setServiceId(String serviceId) {
        this.serviceId = serviceId;
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public String getServiceDescription() {
        return serviceDescription;
    }

    public void setServiceDescription(String serviceDescription) {
        this.serviceDescription = serviceDescription;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getVendorBusinessName() {
        return vendorBusinessName;
    }

    public void setVendorBusinessName(String vendorBusinessName) {
        this.vendorBusinessName = vendorBusinessName;
    }

    public String getVendorId() {
        return vendorId;
    }

    public void setVendorId(String vendorId) {
        this.vendorId = vendorId;
    }

    public double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(double averageRating) {
        this.averageRating = averageRating;
    }

    public List<ServiceDetails> getDetails() {
        return details;
    }

    public void setDetails(List<ServiceDetails> details) {
        this.details = details;
    }
}
