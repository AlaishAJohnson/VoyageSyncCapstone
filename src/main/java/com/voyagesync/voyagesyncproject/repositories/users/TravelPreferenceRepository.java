package com.voyagesync.voyagesyncproject.repositories.users;

import com.voyagesync.voyagesyncproject.models.users.TravelPreferences;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Repository;

@Repository
public interface TravelPreferenceRepository extends MongoRepository<TravelPreferences, ObjectId> {
    TravelPreferences findByPreferenceId(ObjectId preferenceId);
}
