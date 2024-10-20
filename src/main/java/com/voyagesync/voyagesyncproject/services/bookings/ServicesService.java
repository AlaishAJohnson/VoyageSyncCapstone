package com.voyagesync.voyagesyncproject.services.bookings;

import com.voyagesync.voyagesyncproject.models.bookings.Services;
import com.voyagesync.voyagesyncproject.repositories.bookings.ServiceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ServicesService {

    private final ServiceRepository serviceRepository;
    public ServicesService(final ServiceRepository serviceRepository) {
        this.serviceRepository = serviceRepository;
    }

    public List<Services> getAllServices() {
        return serviceRepository.findAll();
    }
}
