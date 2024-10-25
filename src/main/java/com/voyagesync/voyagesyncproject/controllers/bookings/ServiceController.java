package com.voyagesync.voyagesyncproject.controllers.bookings;

import com.voyagesync.voyagesyncproject.models.bookings.Services;
import com.voyagesync.voyagesyncproject.services.bookings.ServicesService;
import com.voyagesync.voyagesyncproject.models.bookings.ServiceAvailability; //Remove
import org.bson.types.ObjectId;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/services")
public class ServiceController {
    private final ServicesService servicesService;
    

    public ServiceController(final ServicesService servicesService) {
        this.servicesService = servicesService;
    }

    @GetMapping("/location")
    public ResponseEntity<List<Map<String, Object>>> getServicesByLocation(@RequestParam String location) {
        List<Services> servicesList = servicesService.getByLocation(location);
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
        }).collect(Collectors.toList());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/price")
    public ResponseEntity<List<Map<String, Object>>> getServicesByPrice(@RequestParam String price) {
        List<Services> servicesList = servicesService.getByPrice(price);
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
        }).collect(Collectors.toList());
        return new ResponseEntity<>(response, HttpStatus.OK);
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
