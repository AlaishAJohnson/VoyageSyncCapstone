package com.voyagesync.voyagesyncproject.controllers.bookings;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/service-availability")
@CrossOrigin(origins = "http://localhost:8081")
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

//    @GetMapping("/{serviceId}/{date}")
//    public List<ServiceAvailability> getServiceAvailability(@PathVariable String serviceId, @PathVariable String date) {
//        ObjectId id = new ObjectId(serviceId);
//        LocalDate serviceDate = LocalDate.parse(date);
//        return serviceAvailabilityService.getServiceAvailabilityByServiceIdAndDate(id, serviceDate);
//    } // returning an empty array, needs to be debugged

    // Create Service Availability (Restricted to Vendor Role)
//    @PreAuthorize("hasRole('ROLE_VENDOR') or hasRole('ROLE_ADMIN')")
    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public ServiceAvailability createServiceAvailability(@RequestBody ServiceAvailability serviceAvailability) {
        return serviceAvailabilityService.createServiceAvailability(serviceAvailability);
    }

    // Update Service Availability (Restricted to Vendor Role)
//    @PreAuthorize("hasRole('ROLE_VENDOR') or hasRole('ROLE_ADMIN')")
    @PutMapping("/update/{id}")
    public ServiceAvailability updateServiceAvailability(@PathVariable("id") String serviceAvailabilityId, @RequestBody ServiceAvailability serviceAvailability) {
        return serviceAvailabilityService.updateServiceAvailability(serviceAvailabilityId, serviceAvailability);
    }

    // Delete Service Availability (Restricted to Vendor Role)
//    @PreAuthorize("hasRole('ROLE_VENDOR') or hasRole('ROLE_ADMIN')")
    @DeleteMapping("/delete/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteServiceAvailability(@PathVariable("id") String serviceAvailabilityId) {
        serviceAvailabilityService.deleteServiceAvailability(serviceAvailabilityId);
    }

}
