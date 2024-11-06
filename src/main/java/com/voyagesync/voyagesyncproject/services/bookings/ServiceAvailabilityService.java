package com.voyagesync.voyagesyncproject.services.bookings;

import com.voyagesync.voyagesyncproject.models.bookings.ServiceAvailability;
import com.voyagesync.voyagesyncproject.models.bookings.Services;
import com.voyagesync.voyagesyncproject.repositories.bookings.ServiceAvailabilityRepository;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ServiceAvailabilityService {
    private final ServiceAvailabilityRepository serviceAvailabilityRepository;
    public ServiceAvailabilityService(final ServiceAvailabilityRepository serviceAvailabilityRepository) {
        this.serviceAvailabilityRepository = serviceAvailabilityRepository;
    }

    public List<ServiceAvailability> getAllServiceAvailability() {
        return serviceAvailabilityRepository.findAll();
    }


    public List<ServiceAvailability> getServiceAvailabilityByServiceId(final ObjectId serviceId) {
        return serviceAvailabilityRepository.findByServiceId(serviceId);
    }

    // Create service availability for a new service
    @Transactional
    public void createAvailabilityForService(Services service) {
        ServiceAvailability serviceAvailability = new ServiceAvailability();
        serviceAvailability.setServiceId(service.getServiceId());
        serviceAvailability.setAvailableSlots(10);  // Default available slots
        serviceAvailability.setAvailable(true);     // Default availability status
        serviceAvailability.setDateOfService(null); // based on scheduling logic
        serviceAvailability.setTimeOfService(null); // same as above^^^^

        serviceAvailabilityRepository.save(serviceAvailability);
    }

    // Update service availability when the service is updated
    @Transactional
    public void updateAvailabilityForService(Services existingService, Services newService) {
        List<ServiceAvailability> availabilities = serviceAvailabilityRepository.findByServiceId(existingService.getServiceId());
        for (ServiceAvailability availability : availabilities) {
            availability.setAvailableSlots(newService.getAvailableSlots()); // Update available slots
            availability.setAvailable(newService.isAvailable());            // Update availability status
            serviceAvailabilityRepository.save(availability);
        }
    }

    // Delete service availability by Service ID
    @Transactional
    public void deleteAvailabilityForService(ObjectId serviceId) {
        serviceAvailabilityRepository.deleteByServiceId(serviceId);
    }

    // Create a service availability record (manual)
    public ServiceAvailability createServiceAvailability(ServiceAvailability serviceAvailability) {
        serviceAvailability.setAvailable(true); // Default availability
        serviceAvailability.setAvailableSlots(10); // Default available slots
        return serviceAvailabilityRepository.save(serviceAvailability);
    }

    // Update a specific service availability by ID
    @Transactional
    public ServiceAvailability updateServiceAvailability(String serviceAvailabilityId, ServiceAvailability updatedServiceAvailability) {
        // Convert the string ID to ObjectId
        ObjectId id = new ObjectId(serviceAvailabilityId);

        // Find the existing ServiceAvailability record
        ServiceAvailability existingServiceAvailability = serviceAvailabilityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service Availability not found with ID: " + serviceAvailabilityId));

        // then Update the fields of the existing service availability
        existingServiceAvailability.setServiceId(updatedServiceAvailability.getServiceId());
        existingServiceAvailability.setDateOfService(updatedServiceAvailability.getDateOfService());
        existingServiceAvailability.setTimeOfService(updatedServiceAvailability.getTimeOfService());
        existingServiceAvailability.setAvailable(updatedServiceAvailability.isAvailable());
        existingServiceAvailability.setAvailableSlots(updatedServiceAvailability.getAvailableSlots());

        // Save the updated service availability
        return serviceAvailabilityRepository.save(existingServiceAvailability);
    }

    // Delete service availability by ID
    @Transactional
    public void deleteServiceAvailability(String serviceAvailabilityId) {
        // Convert the string ID to ObjectId
        ObjectId id = new ObjectId(serviceAvailabilityId);

        // Find the existing ServiceAvailability record
        ServiceAvailability existingServiceAvailability = serviceAvailabilityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service Availability not found with ID: " + serviceAvailabilityId));

        // Delete the service availability from the repository
        serviceAvailabilityRepository.delete(existingServiceAvailability);
    }
}
