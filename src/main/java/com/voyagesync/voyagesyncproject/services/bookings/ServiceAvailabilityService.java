package com.voyagesync.voyagesyncproject.services.bookings;

import com.voyagesync.voyagesyncproject.models.bookings.ServiceAvailability;
import com.voyagesync.voyagesyncproject.repositories.bookings.ServiceAvailabilityRepository;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
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

}
