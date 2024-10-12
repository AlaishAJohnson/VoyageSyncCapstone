package com.example.voyagesynccapstone.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;
import java.util.Map;

@Document(collection = "groupTrips")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class GroupTrips extends Trips {

    @Id
    private ObjectId groupTripID;
    private ObjectId tripID;
    private Map<String, List<ObjectId>> memberIDs;


}
