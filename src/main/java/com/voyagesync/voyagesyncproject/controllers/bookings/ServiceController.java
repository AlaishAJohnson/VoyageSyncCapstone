package com.voyagesync.voyagesyncproject.controllers.bookings;

import com.voyagesync.voyagesyncproject.models.bookings.Services;
import com.voyagesync.voyagesyncproject.services.bookings.ServicesService;
import org.bson.types.ObjectId;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/services")
public class ServiceController {
    private final ServicesService servicesService;
    public ServiceController(final ServicesService servicesService) {
        this.servicesService = servicesService;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllServices() {
        List<Services> servicesList = servicesService.getAllServices();
        // Transform the services into a desired JSON format
        List<Map<String, Object>> response = servicesList.stream().map(service -> {
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
        }).toList();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}
