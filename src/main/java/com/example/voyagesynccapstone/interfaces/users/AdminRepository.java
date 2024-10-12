package com.example.voyagesynccapstone.interfaces;

import com.example.voyagesynccapstone.model.users.Admins;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AdminRepository extends MongoRepository <Admins, ObjectId> {
    Admins findByAdminID(ObjectId adminID);
    Admins findByUserID(ObjectId userID);
    List<Admins> findAllAdmins();
    List<Admins> findByDateAssigned(LocalDate dateAssigned);
    void deleteByAdminID(ObjectId adminID);


}
