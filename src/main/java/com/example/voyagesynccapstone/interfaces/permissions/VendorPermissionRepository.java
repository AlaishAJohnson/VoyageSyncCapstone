package com.example.voyagesynccapstone.interfaces.permissions;

import com.example.voyagesynccapstone.model.permissions.VendorPermissions;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VendorPermissionRepository extends MongoRepository<VendorPermissions, ObjectId> {

    VendorPermissions findByUserID(ObjectId userID);
    List<VendorPermissions> findByUserIDIn(List<ObjectId> userIDs);
    List<VendorPermissions> findByCanListServices(boolean canListServices);
    List<VendorPermissions> findByCanManageBookings(boolean canManageBookings);
    List<VendorPermissions> findByCanCommunicateWithOrganizers(boolean canCommunicateWithOrganizers);
    List<VendorPermissions> findByCanUpdateServiceDetails(boolean canUpdateServiceDetails);
}
