package com.example.voyagesynccapstone.interfaces.permissions;

import com.example.voyagesynccapstone.model.permissions.AdminPermissions;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdminPermissionRepository extends MongoRepository<AdminPermissions, ObjectId> {
    List<AdminPermissions> findByUserID(ObjectId userID);
    List<AdminPermissions> findByCanManageUsersTrue();
    List<AdminPermissions> findByCanManageVendorsTrue();
    List<AdminPermissions> findByCanManageTripsTrue();
    List<AdminPermissions> findByCanViewReportsTrue();
    List<AdminPermissions> findByCanConfigureSettingsTrue();
}
