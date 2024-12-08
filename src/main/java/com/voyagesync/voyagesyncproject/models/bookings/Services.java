package com.voyagesync.voyagesyncproject.models.bookings;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.TypeAlias;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Document(collection = "Services")
@TypeAlias("")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Services {
    @Id
    private ObjectId serviceId;

    @Field("vendorId")
    private ObjectId vendorId;
    private String serviceName;
    private String serviceDescription;
    private double price;
    private String location;

    public int openSlots;
    public boolean isAvailable;
    public LocalDate serviceDate;
    public LocalTime serviceTime;




    public int getAvailableSlots() {
        return 0;
    }

    public boolean isAvailable() {
        return false;
    }

}
