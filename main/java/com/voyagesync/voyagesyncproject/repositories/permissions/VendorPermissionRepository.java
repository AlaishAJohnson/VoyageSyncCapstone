package com.voyagesync.voyagesyncproject.repositories.permissions;

import com.voyagesync.voyagesyncproject.models.permissions.VendorPermissions;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VendorPermissionRepository extends MongoRepository<VendorPermissions, ObjectId> {
}
