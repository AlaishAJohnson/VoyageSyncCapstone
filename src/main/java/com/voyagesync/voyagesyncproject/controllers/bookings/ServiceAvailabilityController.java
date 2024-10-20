package com.voyagesync.voyagesyncproject.controllers.bookings;

import com.voyagesync.voyagesyncproject.models.bookings.ServiceAvailability;
import com.voyagesync.voyagesyncproject.services.bookings.ServiceAvailabilityService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/service-availability")
public class ServiceAvailabilityController {
    private final ServiceAvailabilityService serviceAvailabilityService;
    public ServiceAvailabilityController(final ServiceAvailabilityService serviceAvailabilityService) {
        this.serviceAvailabilityService = serviceAvailabilityService;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllServiceAvailability() {
        List<ServiceAvailability> availabilities = serviceAvailabilityService.getAllServiceAvailability();
        List<Map<String, Object>> response = availabilities.stream().map(serviceAvailability -> {
            Map<String, Object> availabilityMap = new LinkedHashMap<>();
            availabilityMap.put("serviceAvailabilityId", serviceAvailability.getServiceAvailabilityId().toHexString());
            availabilityMap.put("serviceId", serviceAvailability.getServiceId().toHexString());
            availabilityMap.put("dateOfService", serviceAvailability.getDateOfService());
            availabilityMap.put("timeOfService", serviceAvailability.getTimeOfService());
            availabilityMap.put("isAvailable", serviceAvailability.isAvailable());
            availabilityMap.put("availableSlots", serviceAvailability.getAvailableSlots());
            return availabilityMap;
        }).toList();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
