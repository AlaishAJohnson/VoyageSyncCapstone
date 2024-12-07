package com.voyagesync.voyagesyncproject.controllers.bookings;

import com.voyagesync.voyagesyncproject.models.bookings.Services;
import com.voyagesync.voyagesyncproject.services.bookings.ServiceWithVendorDTO;
import com.voyagesync.voyagesyncproject.services.bookings.ServicesService;
import com.voyagesync.voyagesyncproject.services.users.VendorService;
import org.bson.types.ObjectId;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = "http://localhost:8081")
public class ServiceController {

    private final ServicesService servicesService;
    private final VendorService vendorService;

    private static final Logger logger = LoggerFactory.getLogger(ServiceController.class);

    public ServiceController(final ServicesService servicesService, VendorService vendorService) {
        this.servicesService = servicesService;
        this.vendorService = vendorService;
    }

    // Fetch a single service with vendor info
    @GetMapping("/{id}")
    public ResponseEntity<ServiceWithVendorDTO> getServiceById(@PathVariable ObjectId id) {
        try {
            ServiceWithVendorDTO serviceResponse = servicesService.getServiceById(id); // Fetch service with vendor details
            return ResponseEntity.ok(serviceResponse);
        } catch (Exception e) {
            logger.error("Error fetching service by ID {}: {}", id, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ServiceWithVendorDTO()); // Return empty DTO or custom error message as needed
        }
    }

    // Fetch all services with vendor info
    @GetMapping("/vendor")
    public ResponseEntity<List<ServiceWithVendorDTO>> getAllServicesWithVendorInfo() {
        try {
            List<ServiceWithVendorDTO> serviceResponses = servicesService.getAllServices().stream()
                    .map(servicesService::mapServiceWithVendorToDTO)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(serviceResponses);
        } catch (Exception e) {
            logger.error("Error fetching all services with vendor info: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null); // Return empty list or custom error message as needed
        }
    }

    // Filter services by vendor's industry
    @GetMapping("/industry")
    public ResponseEntity<List<ServiceWithVendorDTO>> getServicesByVendorIndustry(@RequestParam final String industry) {
        try {
            List<ObjectId> serviceIds = vendorService.getServiceIdByIndustry(industry);
            List<Services> servicesList = servicesService.getServicesById(serviceIds);
            List<ServiceWithVendorDTO> response = servicesList.stream()
                    .map(servicesService::mapServiceWithVendorToDTO)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error fetching services by vendor industry '{}': {}", industry, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    // Fetch services by vendor
    @GetMapping("/by-vendor/{vendorId}")
    public ResponseEntity<List<ServiceWithVendorDTO>> getServicesByVendor(@PathVariable ObjectId vendorId) {
        try {
            List<Services> services = servicesService.getServicesByVendorId(vendorId);
            List<ServiceWithVendorDTO> serviceDTOs = services.stream()
                    .map(servicesService::mapServiceWithVendorToDTO)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(serviceDTOs);
        } catch (Exception e) {
            logger.error("Error fetching services by vendor ID '{}': {}", vendorId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    // Fetch all services
    @GetMapping("/all")
    public ResponseEntity<List<ServiceWithVendorDTO>> getAllServices() {
        try {
            List<Services> servicesList = servicesService.getAllServices();
            List<ServiceWithVendorDTO> response = servicesList.stream()
                    .map(servicesService::mapServiceWithVendorToDTO)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error fetching all services: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    // Create a new service
    @PostMapping
    public ResponseEntity<Services> createService(@RequestBody Services service) {
        try {
            Services createdService = servicesService.createService(service);
            return new ResponseEntity<>(createdService, HttpStatus.CREATED);
        } catch (Exception e) {
            logger.error("Error creating service: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // Update an existing service
    @PutMapping("/update/{serviceId}")
    public ResponseEntity<Services> updateService(@PathVariable ObjectId serviceId, @RequestBody Services service) {
        try {
            Services updatedService = servicesService.updateService(serviceId, service);
            return ResponseEntity.ok(updatedService);
        } catch (Exception e) {
            logger.error("Error updating service with ID '{}': {}", serviceId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // Delete an existing service
    @DeleteMapping("delete/{serviceId}")
    public ResponseEntity<Void> deleteService(@PathVariable ObjectId serviceId) {
        try {
            // Delete the service and any associated data if needed
            servicesService.deleteService(serviceId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            logger.error("Error deleting service with ID '{}': {}", serviceId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
