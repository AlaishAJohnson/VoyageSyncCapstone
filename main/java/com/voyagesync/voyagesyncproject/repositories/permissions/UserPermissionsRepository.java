package com.voyagesync.voyagesyncproject.repositories.permissions;

import com.voyagesync.voyagesyncproject.models.permissions.UserPermissions;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserPermissionsRepository extends MongoRepository<UserPermissions, ObjectId> {
}
