package com.voyagesync.voyagesyncproject.config;

import com.voyagesync.voyagesyncproject.models.bookings.ServiceAvailability;
import com.voyagesync.voyagesyncproject.repositories.bookings.ServiceAvailabilityRepository;
import org.springframework.core.convert.converter.Converter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.bson.types.ObjectId;

@Component  // Make it a Spring component so Spring can manage its lifecycle
public class ObjectIdToServiceAvailabilityConverter implements Converter<ObjectId, ServiceAvailability> {

    private final ServiceAvailabilityRepository serviceAvailabilityRepository;

    @Autowired
    public ObjectIdToServiceAvailabilityConverter(ServiceAvailabilityRepository serviceAvailabilityRepository) {
        this.serviceAvailabilityRepository = serviceAvailabilityRepository;
    }

    @Override
    public ServiceAvailability convert(ObjectId source) {
        System.out.println("Converting ObjectId: " + source);
        return serviceAvailabilityRepository.findById(source.toString()).orElse(null);
    }
}
