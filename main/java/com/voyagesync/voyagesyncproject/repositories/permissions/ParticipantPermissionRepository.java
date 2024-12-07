package com.voyagesync.voyagesyncproject.repositories.permissions;

import com.voyagesync.voyagesyncproject.models.permissions.ParticipantPermissions;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ParticipantPermissionRepository extends MongoRepository<ParticipantPermissions, ObjectId> {
}
