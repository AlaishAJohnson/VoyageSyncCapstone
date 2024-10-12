package com.example.voyagesynccapstone.interfaces.permissions;

import com.example.voyagesynccapstone.model.permissions.Permissions;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;


@Repository
public interface PermissionRepository extends MongoRepository<Permissions, ObjectId> {
    List<Permissions> findByUserID(ObjectId userID);
    Permissions findByPermissionID(ObjectId permissionID);
    List<Permissions> findByDateAssigned(LocalDate dateAssigned);
}
