package com.voyagesync.voyagesyncproject.models.trips;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("Votes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vote {
    @Id
    private ObjectId voteId;
    private ObjectId userId;
    private boolean vote;
    private ObjectId itineraryId;
}
