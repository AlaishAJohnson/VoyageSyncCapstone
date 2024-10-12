package com.example.voyagesynccapstone.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "services")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Services {

    @Id
    private ObjectId serviceID;
    private String serviceName;
    private String serviceDescription;
    private String serviceType;
    private String servicePrice;

    // Reference
    private ObjectId vendorID;
}
