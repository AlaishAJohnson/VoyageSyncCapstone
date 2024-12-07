package com.voyagesync.voyagesyncproject.models.bookings;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.TypeAlias;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "Services")
@TypeAlias("")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Services {

    @Id
    private ObjectId id;

    @Field("vendorId")
    private ObjectId vendorId;

    private String serviceName;

    private String serviceDescription;

    private Double price;

    private String location;

    private Integer openSlots;

    private String duration;

    private String typeOfService;

    private String timeFrame;


}
