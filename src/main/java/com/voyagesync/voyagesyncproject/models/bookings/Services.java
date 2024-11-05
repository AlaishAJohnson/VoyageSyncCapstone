package com.voyagesync.voyagesyncproject.models.bookings;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.TypeAlias;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import com.voyagesync.voyagesyncproject.models.bookings.ServiceAvailability; //Remove
import java.util.List;

@Document(collection = "Services")
@TypeAlias("")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Services {
    @Id
    private ObjectId serviceId;
    private String serviceName;
    private String serviceDescription;
    @DBRef
    private List<ObjectId> serviceAvailability;
    private double price;

    //nonsense
    private String location;
    private ServiceAvailability details;
}
