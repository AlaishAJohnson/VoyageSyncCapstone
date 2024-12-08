package com.voyagesync.voyagesyncproject.services.bookings;

import com.voyagesync.voyagesyncproject.dto.ServiceWithVendorDTO;
import com.voyagesync.voyagesyncproject.models.bookings.Services;
import com.voyagesync.voyagesyncproject.models.users.Vendors;
import com.voyagesync.voyagesyncproject.repositories.bookings.ServiceRepository;
import com.voyagesync.voyagesyncproject.repositories.users.VendorRepository;
import org.bson.types.ObjectId;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ServicesService {

    private final ServiceRepository serviceRepository;
    private final VendorRepository vendorRepository;
    private final FeedbackService feedbackService;


    public ServicesService(final ServiceRepository serviceRepository, final VendorRepository vendorRepository, final FeedbackService feedbackService) {
        this.serviceRepository = serviceRepository;
        this.vendorRepository = vendorRepository;
        this.feedbackService = feedbackService;
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

    public List<Services> getServicesById(List<ObjectId> serviceIds) {
        return serviceRepository.findByServiceIdIn(serviceIds);
    }

    public Services getServiceByServiceId(ObjectId id) {
        return serviceRepository.findById(id).orElse(null);
    }
    public ServiceWithVendorDTO getServiceById(ObjectId serviceId) {
        Services service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found"));

        return mapServiceWithVendorToDTO(service);
    }

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

    public List<ServiceWithVendorDTO> getAllServicesWithVendorInfo() {
        List<Services> services = getAllServices();
        return services.stream()
                .map(this::mapServiceWithVendorToDTO)
                .collect(Collectors.toList());
    }

    public ServiceWithVendorDTO mapServiceWithVendorToDTO(Services service) {
        Optional<Vendors> vendorOptional = vendorRepository.findById(service.getVendorId());

        ServiceWithVendorDTO response = new ServiceWithVendorDTO();
        response.setServiceId(service.getServiceId().toHexString());
        response.setServiceName(service.getServiceName());
        response.setServiceDescription(service.getServiceDescription());
        response.setPrice(service.getPrice());

        vendorOptional.ifPresent(vendor -> {
            response.setVendorBusinessName(vendor.getBusinessName());
            response.setVendorId(vendor.getVendorId().toHexString());
        });

        response.setAverageRating(getAverageRatingForService(service.getServiceId()));
        response.setOpenSlots(service.getOpenSlots());
        return response;
    }

    public Services createService(Services service) {
        // Create availability for the service before saving it
//        serviceAvailabilityService.createAvailabilityForService(service);
        return serviceRepository.save(service);
    }

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
//        serviceAvailabilityService.updateAvailabilityForService(existingService, service);

        return serviceRepository.save(existingService);
    }

    public void deleteService(String serviceId) {
        ObjectId id = new ObjectId(serviceId);

        if (!serviceRepository.existsById(id)) {
            throw new IllegalArgumentException("Service with ID " + serviceId + " not found.");
        }
//        serviceAvailabilityService.deleteAvailabilityForService(id);
        serviceRepository.deleteById(id);
    }

    public List<Services> getServicesByVendorId(ObjectId vendorId) {
        // Debug log to check vendorId
        System.out.println("Fetching services for vendorId: " + vendorId);

        // Query the database for services by vendorId
        List<Services> services = serviceRepository.findByVendorId(vendorId);

        // Log the result
        System.out.println("Found services: " + services);

        return services;
    }



}
