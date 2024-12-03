package com.voyagesync.voyagesyncproject.models.users;

import com.mongodb.lang.Nullable;
import com.voyagesync.voyagesyncproject.enums.VerificationStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;


import java.util.List;
import java.time.LocalDateTime;

@Document(collection = "Users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Users {
    @Id
    private ObjectId id;
    private String firstName;
    private String lastName;
    private String username;
    private String email;
    private String password;
    private String phoneNumber;
    private String role;

    @Nullable
    @DocumentReference
    private TravelPreferences travelPreferences;
    private LocalDateTime createdAt;
    private VerificationStatus verificationStatus = VerificationStatus.PENDING;
    private boolean active;

    @Nullable private List<ObjectId> trips;
    @Nullable private List<ObjectId> friendIds;
    @Nullable private List<ObjectId> userPermission;
    @Nullable private LocalDateTime permissionAssignmentDate;

}
