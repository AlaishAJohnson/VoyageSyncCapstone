package com.voyagesync.voyagesyncproject.services.bookings;

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

import java.util.List;
import java.util.Optional;

@Service
public class ServicesService {

    private final ServiceRepository serviceRepository;
    private final VendorRepository vendorRepository;
    private final FeedbackService feedbackService;

    private static final Logger log = LoggerFactory.getLogger(ServicesService.class);

    public ServicesService(
            final ServiceRepository serviceRepository,
            final VendorRepository vendorRepository,
            final FeedbackService feedbackService
    ) {
        this.serviceRepository = serviceRepository;
        this.vendorRepository = vendorRepository;
        this.feedbackService = feedbackService;
    }

    // Fetch all services
    public List<Services> getAllServices() {
        return serviceRepository.findAll();
    }

    // Fetch services by service IDs
    public List<Services> getServicesById(List<ObjectId> serviceIds) {
        return serviceRepository.findByIdIn(serviceIds);
    }

    // Fetch a single service by its ID with vendor info
    public ServiceWithVendorDTO getServiceById(ObjectId serviceId) {
        Services service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found"));

        return mapServiceWithVendorToDTO(service);
    }

    // Map a service to ServiceWithVendorDTO, including vendor details and root-level fields
    public ServiceWithVendorDTO mapServiceWithVendorToDTO(Services service) {
        // Find vendor based on vendorId
        Optional<Vendors> vendorOptional = vendorRepository.findById(service.getVendorId());

        ServiceWithVendorDTO response = new ServiceWithVendorDTO();
        response.setServiceId(service.getId());
        response.setServiceName(service.getServiceName());
        response.setServiceDescription(service.getServiceDescription());
        response.setPrice(service.getPrice());
        response.setLocation(service.getLocation());
        response.setDuration(service.getDuration());
        response.setTypeOfService(service.getTypeOfService());
        response.setTimeFrame(service.getTimeFrame());
        response.setAverageRating(getAverageRatingForService(service.getId()));
        response.setOpenSlots(service.getOpenSlots());


        // Map vendor details if available
        vendorOptional.ifPresent(vendor -> {
            response.setVendorBusinessName(vendor.getBusinessName());
            response.setVendorId(vendor.getVendorId());
        });
        return response;
    }

    // Calculate the average rating for a service
    private double getAverageRatingForService(ObjectId serviceId) {
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

    // Create a new service
    public Services createService(Services service) {
        // Save the service to the repository
        Services savedService = serviceRepository.save(service);
        return savedService;
    }

    // Update an existing service
    public Services updateService(ObjectId serviceId, Services updatedService) {
        // Fetch the existing service
        Services existingService = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found"));

        // Merge the updated fields with the existing service, with validation
        if (updatedService.getServiceName() != null && !updatedService.getServiceName().isEmpty()) {
            existingService.setServiceName(updatedService.getServiceName());
        }

        if (updatedService.getServiceDescription() != null && !updatedService.getServiceDescription().isEmpty()) {
            existingService.setServiceDescription(updatedService.getServiceDescription());
        }

        if (updatedService.getPrice() != null) {
            existingService.setPrice(updatedService.getPrice());
        }

        if (updatedService.getLocation() != null && !updatedService.getLocation().isEmpty()) {
            existingService.setLocation(updatedService.getLocation());
        }

        if (updatedService.getDuration() != null) {
            existingService.setDuration(updatedService.getDuration());
        }

        if (updatedService.getTypeOfService() != null) {
            existingService.setTypeOfService(updatedService.getTypeOfService());
        }

        if (updatedService.getTimeFrame() != null) {
            existingService.setTimeFrame(updatedService.getTimeFrame());
        }

        // Save and return the updated service
        return serviceRepository.save(existingService);
    }

    // Delete an existing service
    public void deleteService(ObjectId serviceId) {
        if (!serviceRepository.existsById(serviceId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found");
        }

        serviceRepository.deleteById(serviceId);
    }

    // Fetch services by vendor ID
    public List<Services> getServicesByVendorId(ObjectId vendorId) {
        log.debug("Fetching services for vendorId: {}", vendorId);
        return serviceRepository.findByVendorId(vendorId);
    }
}
