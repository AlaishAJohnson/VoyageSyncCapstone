//package com.voyagesync.voyagesyncproject.config;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.data.mongodb.core.convert.MongoCustomConversions;
//import com.voyagesync.voyagesyncproject.config.ObjectIdToServiceAvailabilityConverter;
//
//import java.util.List;
//
//@Configuration
//public class MongoConverterConfig {
//
//    private final ObjectIdToServiceAvailabilityConverter objectIdToServiceAvailabilityConverter;
//
//    public MongoConverterConfig(ObjectIdToServiceAvailabilityConverter objectIdToServiceAvailabilityConverter) {
//        this.objectIdToServiceAvailabilityConverter = objectIdToServiceAvailabilityConverter;
//    }
//
//    @Bean
//    public MongoCustomConversions customConversions() {
//        return new MongoCustomConversions(List.of(objectIdToServiceAvailabilityConverter));
//    }
//}
