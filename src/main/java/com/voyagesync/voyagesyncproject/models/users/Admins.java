package com.voyagesync.voyagesyncproject.models.users;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDate;
import java.util.List;

@Document(collection = "Admin")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Admins {
    @Id
    private ObjectId adminId;
    @Field("userId")
    private ObjectId userId;
    @Field("permissionAssignmentDate")
    private LocalDate permissionAssignmentDate;
    @Field("adminPermissions")
    private List<ObjectId> adminPermissions;

}
