package com.voyagesync.voyagesyncproject.controllers.bookings;

import com.voyagesync.voyagesyncproject.dto.ServiceResponse;
import com.voyagesync.voyagesyncproject.models.bookings.Services;
import com.voyagesync.voyagesyncproject.models.users.Vendors;
import com.voyagesync.voyagesyncproject.services.bookings.FeedbackService;
import com.voyagesync.voyagesyncproject.services.bookings.ServicesService;
import com.voyagesync.voyagesyncproject.services.users.VendorService;
import org.bson.types.ObjectId;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/services")
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


    /* HELPER FUNCTIONS */


    private Map<String, Object> mapServicesToResponse(Services service) {
        Map<String, Object> serviceMap = new LinkedHashMap<>();

        serviceMap.put("serviceId", service.getServiceId().toHexString());
        serviceMap.put("serviceName", service.getServiceName());
        serviceMap.put("serviceDescription", service.getServiceDescription());
        serviceMap.put("price", service.getPrice());

        List<String> serviceAvailabilityIds = service.getServiceAvailability().stream()
                .map(ObjectId::toHexString)
                .collect(Collectors.toList());
        serviceMap.put("serviceAvailability", serviceAvailabilityIds);


        return serviceMap;
    }
}
