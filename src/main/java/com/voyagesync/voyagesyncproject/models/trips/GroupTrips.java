package com.voyagesync.voyagesyncproject.models.trips;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "GroupTrips")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GroupTrips {

    @Id
    private ObjectId groupTripId;
    private List<ObjectId> members;
    private MajorityVoteRule majorityVoteRule;
    private boolean votingStatus = Boolean.FALSE;
    private LocalDateTime createdAt;

    public enum MajorityVoteRule {
        SIMPLE_MAJORITY,
        ADVANCED_MAJORITY
    }
}
