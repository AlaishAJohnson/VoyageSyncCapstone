package com.voyagesync.voyagesyncproject.services.bookings;

import com.voyagesync.voyagesyncproject.models.bookings.ServiceDetails;
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

import java.util.ArrayList;
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

    // Fetch a single service by its ID with vendor info and details
    public ServiceWithVendorDTO getServiceById(ObjectId serviceId) {
        Services service = serviceRepository.findById(String.valueOf(serviceId))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found"));

        return mapServiceWithVendorToDTO(service);
    }

    // Map a service to ServiceWithVendorDTO, including details
    public ServiceWithVendorDTO mapServiceWithVendorToDTO(Services service) {
        // Find vendor based on vendorId
        Optional<Vendors> vendorOptional = vendorRepository.findById(service.getVendorId());

        ServiceWithVendorDTO response = new ServiceWithVendorDTO();
        response.setServiceId(service.getId().toHexString());
        response.setServiceName(service.getServiceName());
        response.setServiceDescription(service.getServiceDescription());
        response.setPrice(service.getPrice());
        response.setLocation(service.getLocation());

        // Map vendor details if available
        vendorOptional.ifPresent(vendor -> {
            response.setVendorBusinessName(vendor.getBusinessName());
            response.setVendorId(vendor.getVendorId().toHexString());
        });

        // Fetch the average rating for the service
        response.setAverageRating(getAverageRatingForService(service.getId()));

        // Return the details directly from the Service object
        response.setDetails(service.getDetails());

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

    // Create a new service with details field
    public Services createService(Services service) {
        // Save the service to the repository
        Services savedService = serviceRepository.save(service);

        return savedService;
    }

    public Services updateService(ObjectId serviceId, Services updatedService) {
        // Fetch the existing service
        Services existingService = serviceRepository.findById(String.valueOf(serviceId))
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

        // Handle the 'details' field (merge or replace)
        if (updatedService.getDetails() != null && !updatedService.getDetails().isEmpty()) {
            List<ServiceDetails> mergedDetails = getServiceDetails(updatedService, existingService);
            existingService.setDetails(mergedDetails);
        } else if (updatedService.getDetails() == null) {
            // Log or handle cases where 'details' is missing (optional)
            log.warn("Details not provided in update, retaining existing details");
        }

        // Save and return the updated service
        return serviceRepository.save(existingService);
    }

    private List<ServiceDetails> getServiceDetails(Services updatedService, Services existingService) {
        List<ServiceDetails> mergedDetails = new ArrayList<>();

        // If the updatedService has details, merge them
        if (updatedService.getDetails() != null) {
            for (int i = 0; i < updatedService.getDetails().size(); i++) {
                ServiceDetails newDetail = updatedService.getDetails().get(i);
                ServiceDetails oldDetail = (i < existingService.getDetails().size())
                        ? existingService.getDetails().get(i)
                        : null; // Handle case where updatedService has more details than existing

                // Merge fields from old and new details
                if (oldDetail != null) {
                    if (newDetail.getTimeFrame() == null) {
                        newDetail.setTimeFrame(oldDetail.getTimeFrame());
                    }
                    if (newDetail.getDuration() == null) {
                        newDetail.setDuration(oldDetail.getDuration());
                    }
                    if (newDetail.getTypeOfService() == null) {
                        newDetail.setTypeOfService(oldDetail.getTypeOfService());
                    }
                }

                mergedDetails.add(newDetail);
            }
        } else {
            // If no details are provided in the update, retain the existing details
            mergedDetails = existingService.getDetails();
        }

        return mergedDetails;
    }

    // Delete an existing service
    public void deleteService(ObjectId serviceId) {
        if (!serviceRepository.existsById(String.valueOf(serviceId))) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found");
        }

        serviceRepository.deleteById(String.valueOf(serviceId));
    }

    // Fetch services by vendor ID
    public List<Services> getServicesByVendorId(ObjectId vendorId) {
        log.debug("Fetching services for vendorId: {}", vendorId);
        return serviceRepository.findByVendorId(vendorId);
    }

}
