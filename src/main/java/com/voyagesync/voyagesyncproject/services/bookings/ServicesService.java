package com.voyagesync.voyagesyncproject.services.bookings;

import com.voyagesync.voyagesyncproject.models.bookings.ServiceAvailability;
import com.voyagesync.voyagesyncproject.models.bookings.Services;
import com.voyagesync.voyagesyncproject.models.users.Vendors;
import com.voyagesync.voyagesyncproject.repositories.bookings.ServiceRepository;
import com.voyagesync.voyagesyncproject.repositories.users.VendorRepository;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.voyagesync.voyagesyncproject.services.bookings.ServiceWithVendorDTO;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ServicesService {

    private final ServiceRepository serviceRepository;
    private final VendorRepository vendorRepository;
    private final FeedbackService feedbackService;
    private final ServiceAvailabilityService serviceAvailabilityService;
    private static final Logger log = LoggerFactory.getLogger(ServicesService.class);

    public ServicesService(final ServiceRepository serviceRepository, final VendorRepository vendorRepository, final FeedbackService feedbackService, ServiceAvailabilityService serviceAvailabilityService) {
        this.serviceRepository = serviceRepository;
        this.vendorRepository = vendorRepository;
        this.feedbackService = feedbackService;
        this.serviceAvailabilityService = serviceAvailabilityService;
    }

    // Fetch services by location
    public List<Services> getByLocation(String location) {
        return serviceRepository.findByLocation(location);
    }

    // Fetch services by price
    public List<Services> getByPrice(Double price) {
        return serviceRepository.findByPrice(price);
    }

    // Fetch all services
    public List<Services> getAllServices() {
        return serviceRepository.findAll();
    }

    // Fetch services by service IDs
    public List<Services> getServicesById(List<ObjectId> serviceIds) {
        return serviceRepository.findByServiceIdIn(serviceIds);
    }

    // Fetch a single service by its ID
    public Services getServiceByServiceId(ObjectId id) {
        return serviceRepository.findById(id).orElse(null);
    }
    public ServiceWithVendorDTO getServiceById(ObjectId serviceId) {
        Services service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found"));

        return mapServiceWithVendorToDTO(service);
    }

    // Calculate the average rating for a service
    public double getAverageRatingForService(ObjectId serviceId) {
        List<Vendors> vendors = vendorRepository.findAll();
        double totalRating = 0.0;
        int count = 0;

        for (Vendors vendor : vendors) {
            if (vendor.getServices().contains(serviceId)) {
                double averageRating = feedbackService.getAverageRatingByVendorId(vendor.getVendorId());
                totalRating += averageRating;
                count++;
            }
        }

        return count > 0 ? totalRating / count : 0.0;
    }

    // Fetch all services with vendor information
    public List<ServiceWithVendorDTO> getAllServicesWithVendorInfo() {
        List<Services> services = getAllServices();
        return services.stream()
                .map(this::mapServiceWithVendorToDTO)
                .collect(Collectors.toList());
    }

    // Map a service to ServiceWithVendorDTO
    public ServiceWithVendorDTO mapServiceWithVendorToDTO(Services service) {
        // Find vendor based on vendorId
        Optional<Vendors> vendorOptional = vendorRepository.findById(service.getVendorId());

        ServiceWithVendorDTO response = new ServiceWithVendorDTO();
        response.setServiceId(service.getServiceId().toHexString());
        response.setServiceName(service.getServiceName());
        response.setServiceDescription(service.getServiceDescription());
        response.setPrice(service.getPrice());

        // Map vendor details if available
        vendorOptional.ifPresent(vendor -> {
            response.setVendorBusinessName(vendor.getBusinessName());
            response.setVendorId(vendor.getVendorId().toHexString());
        });

        // Fetch the average rating for the service
        response.setAverageRating(getAverageRatingForService(service.getServiceId()));

        // Service Availability: extracting details related to service availability
        List<ObjectId> serviceAvailabilityIds = service.getServiceAvailability().stream()
                .map(ServiceAvailability::getServiceAvailabilityId) // Extract ObjectId from each ServiceAvailability
                .collect(Collectors.toList());

        List<ServiceAvailability> availabilities = serviceAvailabilityService.getServiceAvailabilityByServiceIds(serviceAvailabilityIds);

        // Map availability details
        List<Map<String, Object>> serviceAvailabilityList = availabilities.stream()
                .map(avail -> {
                    Map<String, Object> availabilityMap = new LinkedHashMap<>();
                    availabilityMap.put("serviceAvailabilityId", avail.getServiceAvailabilityId().toHexString());
                    availabilityMap.put("dateOfService", avail.getDateOfService());
                    availabilityMap.put("timeOfService", avail.getTimeOfService());
                    availabilityMap.put("isAvailable", avail.isAvailable());
                    availabilityMap.put("availableSlots", avail.getAvailableSlots());
                    return availabilityMap;
                })
                .collect(Collectors.toList());

        response.setServiceAvailability(serviceAvailabilityList);

        return response;
    }

    // Create a new service
    public Services createService(Services service) {
        // Create availability for the service before saving it
        serviceAvailabilityService.createAvailabilityForService(service);
        return serviceRepository.save(service);
    }

    // Update an existing service
    public Services updateService(String serviceId, Services service) {
        ObjectId id = new ObjectId(serviceId);
        Optional<Services> existingServiceOptional = serviceRepository.findById(id);
        if (existingServiceOptional.isEmpty()) {
            throw new IllegalArgumentException("Service with ID " + serviceId + " not found.");
        }
        Services existingService = existingServiceOptional.get();

        // Update service details
        existingService.setServiceName(service.getServiceName());
        existingService.setServiceDescription(service.getServiceDescription());
        existingService.setPrice(service.getPrice());
        existingService.setLocation(service.getLocation());

        // Update availability information for the service
        serviceAvailabilityService.updateAvailabilityForService(existingService, service);

        return serviceRepository.save(existingService);
    }

    // Delete an existing service
    public void deleteService(String serviceId) {
        ObjectId id = new ObjectId(serviceId);

        if (!serviceRepository.existsById(id)) {
            throw new IllegalArgumentException("Service with ID " + serviceId + " not found.");
        }
        serviceAvailabilityService.deleteAvailabilityForService(id);
        serviceRepository.deleteById(id);
    }

    // Fetch services by vendor ID
    public List<Services> getServicesByVendorId(ObjectId vendorId) {
        // Debug log to check vendorId
        System.out.println("Fetching services for vendorId: " + vendorId);

        // Query the database for services by vendorId
        List<Services> services = serviceRepository.findByVendorId(vendorId);

        // Log the result
        System.out.println("Found services: " + services);

        return services;
    }

    // Fetch services by availability
    public List<Services> getServicesByAvailability(List<ObjectId> serviceAvailabilityIds) {
        return serviceRepository.findByServiceAvailability(serviceAvailabilityIds);
    }

}
