package com.voyagesync.voyagesyncproject.controllers.bookings; // ServiceController.java

import com.voyagesync.voyagesyncproject.models.bookings.Services;
import com.voyagesync.voyagesyncproject.services.bookings.FeedbackService;
import com.voyagesync.voyagesyncproject.services.bookings.ServiceWithVendorDTO;
import com.voyagesync.voyagesyncproject.services.bookings.ServicesService;
import com.voyagesync.voyagesyncproject.services.users.VendorService;
import org.bson.types.ObjectId;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    // Fetch a single service with vendor info
    @GetMapping("/{id}")
    public ResponseEntity<ServiceWithVendorDTO> getServiceById(@PathVariable ObjectId id) {
        ServiceWithVendorDTO serviceResponse = servicesService.getServiceById(id); // Fetch service with vendor details
        return ResponseEntity.ok(serviceResponse);
    }

//    // Fetch a single service by serviceId
//    @GetMapping("/{serviceId}")
//    public ResponseEntity<ServiceWithVendorDTO> getServiceById(@PathVariable String serviceId) {
//        try {
//            ObjectId id = new ObjectId(serviceId);  // Convert string to ObjectId
//            ServiceWithVendorDTO service = servicesService.getServiceById(id);  // Fetch service by ID
//            if (service != null) {
//                return ResponseEntity.ok(service);  // Return the service
//            } else {
//                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);  // Service not found
//            }
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);  // Internal server error
//        }
//    }

    // Fetch all services with vendor info
    @GetMapping("/vendor")
    public ResponseEntity<List<ServiceWithVendorDTO>> getAllServicesWithVendorInfo() {
        List<ServiceWithVendorDTO> serviceResponses = servicesService.getAllServicesWithVendorInfo();
        return ResponseEntity.ok(serviceResponses);
    }

    // Filter services by vendor's industry
    @GetMapping("/industry")
    public ResponseEntity<List<ServiceWithVendorDTO>> getServicesByVendorIndustry(@RequestParam final String industry) {
        List<ObjectId> serviceIds = vendorService.getServiceIdByIndustry(industry);
        List<Services> servicesList = servicesService.getServicesById(serviceIds);
        List<ServiceWithVendorDTO> response = servicesList.stream()
                .map(servicesService::mapServiceWithVendorToDTO) // Map each service to ServiceWithVendorDTO
                .collect(Collectors.toList());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Filter services by location
    @GetMapping("/location")
    public ResponseEntity<List<ServiceWithVendorDTO>> getServicesByLocation(@RequestParam String location) {
        List<Services> servicesList = servicesService.getByLocation(location);
        List<ServiceWithVendorDTO> response = servicesList.stream()
                .map(servicesService::mapServiceWithVendorToDTO) // Map each service to ServiceWithVendorDTO
                .collect(Collectors.toList());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Filter services by price
    @GetMapping("/price")
    public ResponseEntity<List<ServiceWithVendorDTO>> getServicesByPrice(@RequestParam Double price) {
        List<Services> servicesList = servicesService.getByPrice(price);
        List<ServiceWithVendorDTO> response = servicesList.stream()
                .map(servicesService::mapServiceWithVendorToDTO) // Map each service to ServiceWithVendorDTO
                .collect(Collectors.toList());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Fetch services by availability
    @GetMapping("/availability")
    public ResponseEntity<List<ServiceWithVendorDTO>> getServicesByAvailability(@RequestParam List<ObjectId> serviceAvailabilityIds) {
        List<Services> services = servicesService.getServicesByAvailability(serviceAvailabilityIds);
        List<ServiceWithVendorDTO> response = services.stream()
                .map(servicesService::mapServiceWithVendorToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    // Fetch services by vendor
    @GetMapping("/by-vendor/{vendorId}")
    public ResponseEntity<List<ServiceWithVendorDTO>> getServicesByVendor(@PathVariable String vendorId) {
        try {
            ObjectId id = new ObjectId(vendorId); // convert string to ObjectId
            List<Services> services = servicesService.getServicesByVendorId(id);
            List<ServiceWithVendorDTO> serviceDTOs = services.stream()
                    .map(servicesService::mapServiceWithVendorToDTO)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(serviceDTOs);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> errorResponse = new LinkedHashMap<>();
            errorResponse.put("error", "An error occurred while fetching services for vendorId: " + vendorId);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body((List<ServiceWithVendorDTO>) errorResponse);
        }
    }



    // Fetch all services
    @GetMapping
    public ResponseEntity<List<ServiceWithVendorDTO>> getAllServices() {
        List<Services> servicesList = servicesService.getAllServices();
        List<ServiceWithVendorDTO> response = servicesList.stream()
                .map(servicesService::mapServiceWithVendorToDTO) // Map services to ServiceWithVendorDTO
                .collect(Collectors.toList());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Create a new service
    @PostMapping
    public ResponseEntity<Services> createService(@RequestBody Services service) {
        Services createdService = servicesService.createService(service); // Create the service
        return new ResponseEntity<>(createdService, HttpStatus.CREATED);
    }

    // Update an existing service
    @PutMapping("/{serviceId}")
    public ResponseEntity<Services> updateService(@PathVariable String serviceId, @RequestBody Services service) {
        Services updatedService = servicesService.updateService(serviceId, service); // Update the service
        return ResponseEntity.ok(updatedService);
    }

    // Delete an existing service
    @DeleteMapping("/{serviceId}")
    public ResponseEntity<Void> deleteService(@PathVariable String serviceId) {
        servicesService.deleteService(serviceId); // Delete the service
        return ResponseEntity.noContent().build();
    }
}
