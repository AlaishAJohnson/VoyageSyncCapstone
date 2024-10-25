package com.voyagesync.voyagesyncproject.services.bookings;

import com.voyagesync.voyagesyncproject.models.bookings.Services;
import com.voyagesync.voyagesyncproject.repositories.bookings.ServiceRepository;
import com.voyagesync.voyagesyncproject.models.bookings.ServiceAvailability; //Remove

import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
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

    //nonsense
    public List<Services> getByLocation(String location){
        return serviceRepository.getByLocation(location);
    }

    public List<Services> getByPrice(String price){
        return serviceRepository.getByPrice(price);
    }

    //idk
    
    public List<Services> getByAvailability(List<ObjectId> serviceAvailabilityIds){
        return serviceRepository.getByServiceAvailability(serviceAvailabilityIds);
    }

    /* 
    public List<Services> findByDate(LocalDate dateOfService){
        return serviceRepository.getByDateOfService(dateOfService);
    }

    public List<Services> findByDateTime(LocalDate dateOfService, LocalTime timeOfService){
        return serviceRepository.getByDateTime(dateOfService, timeOfService);
    }
    */

    //Location, price, availability, date, date/time


}
