package com.example.voyagesynccapstone.model.permissions;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "permissions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Permissions {
    @Id
    private ObjectId permissionID;
    private String permissionName;
    private ObjectId userID; // reference to user entity
    private LocalDateTime dateAssigned;


}
