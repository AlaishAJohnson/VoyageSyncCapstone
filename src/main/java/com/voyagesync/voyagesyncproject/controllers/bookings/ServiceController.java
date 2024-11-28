package com.voyagesync.voyagesyncproject.controllers.bookings;

import com.voyagesync.voyagesyncproject.dto.ServiceResponse;
import com.voyagesync.voyagesyncproject.models.bookings.Services;
import com.voyagesync.voyagesyncproject.services.bookings.FeedbackService;
import com.voyagesync.voyagesyncproject.services.bookings.ServicesService;
import com.voyagesync.voyagesyncproject.services.users.VendorService;
import org.bson.types.ObjectId;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = "http://localhost:8081")
public class ServiceController {
    private final ServicesService servicesService;
    private final VendorService vendorService;
    private final FeedbackService feedbackService;

    public ServiceController(final ServicesService servicesService, VendorService vendorService, FeedbackService feedbackService) {
        this.servicesService = servicesService;
        this.vendorService = vendorService;
        this.feedbackService = feedbackService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServiceResponse> getServiceById(@PathVariable ObjectId id) {
        ServiceResponse serviceResponse = servicesService.getServiceById(id); // Create this method in your service
        return ResponseEntity.ok(serviceResponse);
    }

    @GetMapping("/vendor")
    public ResponseEntity<List<ServiceResponse>> getAllServicesWithVendorInfo() {
        List<ServiceResponse> serviceResponses = servicesService.getAllServicesWithVendorInfo();
        return ResponseEntity.ok(serviceResponses);
    }

    @GetMapping("/industry")
    public ResponseEntity<List<Map<String, Object>>> getServicesByVendorIndustry(@RequestParam final String industry) {
        List<ObjectId> serviceIds = vendorService.getServiceIdByIndustry(industry);
        List<Services> servicesList = servicesService.getServicesById(serviceIds);
        List<Map<String, Object>> response = servicesList.stream().map(this::mapServicesToResponse).collect(Collectors.toList());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/location")
    public ResponseEntity<List<Map<String, Object>>> getServicesByLocation(@RequestParam String location) {
        List<Services> servicesList = servicesService.getByLocation(location);
        List<Map<String, Object>> response = servicesList.stream().map(this::mapServicesToResponse).collect(Collectors.toList());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/price")
    public ResponseEntity<List<Map<String, Object>>> getServicesByPrice(@RequestParam String price) {
        List<Services> servicesList = servicesService.getByPrice(price);
        List<Map<String, Object>> response = servicesList.stream().map(this::mapServicesToResponse).collect(Collectors.toList());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllServices() {
        List<Services> servicesList = servicesService.getAllServices();
        List<Map<String, Object>> response = servicesList.stream().map(this::mapServicesToResponse).collect(Collectors.toList());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /* POST, PUT, & Delete MAPPING */
    // create service - you need avail. to connect it here. (serviceAvail. repo [the function] service [define] then use it here)
    // Create Service (only accessible by vendors)
    // then admins in the future
    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ROLE_VENDOR')")
    public Services createService(@RequestBody Services service) {
        return servicesService.createService(service);
    }

    // Update Service (only accessible by vendors)
    @PutMapping("/update/{id}")
    @PreAuthorize("hasRole('ROLE_VENDOR')")
    public Services updateService(@PathVariable("id") String serviceId, @RequestBody Services service) {
        return servicesService.updateService(serviceId, service);
    }

    // Delete Service (only accessible by vendors)
    @DeleteMapping("/delete/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ROLE_VENDOR')")
    public void deleteService(@PathVariable("id") String serviceId) {
        servicesService.deleteService(serviceId);
    }

    /* HELPER FUNCTIONS */


    private Map<String, Object> mapServicesToResponse(Services service) {
        Map<String, Object> serviceMap = new LinkedHashMap<>();

        serviceMap.put("serviceId", service.getServiceId().toHexString());
        serviceMap.put("serviceName", service.getServiceName());
        serviceMap.put("serviceDescription", service.getServiceDescription());
        serviceMap.put("price", service.getPrice());

        List<String> serviceAvailabilityIds = service.getServiceAvailability().stream()
                .map(serviceAvailability -> serviceAvailability.getServiceId().toHexString()) // Extract the ObjectId from ServiceAvailability
                .collect(Collectors.toList());
        serviceMap.put("serviceAvailability", serviceAvailabilityIds);


        return serviceMap;
    }
}
