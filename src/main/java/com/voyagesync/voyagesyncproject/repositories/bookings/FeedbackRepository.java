package com.voyagesync.voyagesyncproject.repositories.bookings;

import com.voyagesync.voyagesyncproject.models.bookings.Feedback;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FeedbackRepository extends MongoRepository<Feedback, ObjectId> {
}
