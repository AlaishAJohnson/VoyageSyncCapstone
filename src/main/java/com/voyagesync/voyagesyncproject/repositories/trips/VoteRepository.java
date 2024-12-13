package com.voyagesync.voyagesyncproject.repositories.trips;

import com.voyagesync.voyagesyncproject.models.trips.Vote;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface VoteRepository extends MongoRepository<Vote, ObjectId> {
    Optional<Vote> findByUserIdAndItineraryId(ObjectId userId, ObjectId itineraryId);
    long countByItineraryIdAndVote(ObjectId itineraryId, boolean vote);
    boolean existsByItineraryIdAndUserId(ObjectId itineraryId, ObjectId userId);

}
