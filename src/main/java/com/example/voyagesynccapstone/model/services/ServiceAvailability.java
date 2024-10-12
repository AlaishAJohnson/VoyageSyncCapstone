package com.example.voyagesynccapstone.model.services;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalTime;

@Document(collection = "service_availability")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class ServiceAvailability extends Services {

    @Id
    private ObjectId availabilityID;
    private LocalDate dateOfService;
    private LocalTime timeSlot;
    private double availableSlots;

    // Reference
    private String serviceID;

}
