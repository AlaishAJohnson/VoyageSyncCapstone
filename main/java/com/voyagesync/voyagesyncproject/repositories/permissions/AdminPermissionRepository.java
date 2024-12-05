package com.voyagesync.voyagesyncproject.repositories.permissions;

import com.voyagesync.voyagesyncproject.models.permissions.AdminPermissions;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminPermissionRepository extends MongoRepository<AdminPermissions, ObjectId> {
}
