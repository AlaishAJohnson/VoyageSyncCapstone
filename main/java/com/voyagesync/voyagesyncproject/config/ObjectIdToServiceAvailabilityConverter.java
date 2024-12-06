//package com.voyagesync.voyagesyncproject.config;
//
//import org.springframework.context.annotation.Lazy;
//import org.springframework.core.convert.converter.Converter;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Component;
//import org.bson.types.ObjectId;
//
//@Component
//public class ObjectIdToServiceAvailabilityConverter implements Converter<ObjectId, ServiceAvailability> {
//
//    private final ServiceAvailabilityRepository serviceAvailabilityRepository;
//
//    @Autowired
//    public ObjectIdToServiceAvailabilityConverter( @Lazy ServiceAvailabilityRepository serviceAvailabilityRepository) {
//        this.serviceAvailabilityRepository = serviceAvailabilityRepository;
//    }
//
//    @Override
//    public ServiceAvailability convert(ObjectId source) {
//        System.out.println("Converting ObjectId: " + source);
//        return serviceAvailabilityRepository.findById(source).orElse(null);
//    }
//}
