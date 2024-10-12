package com.example.voyagesynccapstone.model.users;


import com.example.voyagesynccapstone.enums.VerificationStatus;
import com.mongodb.lang.Nullable;
import lombok.*;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Document(collection = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Users {

    @Id
    private ObjectId userID;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String phoneNumber;
    private String role;
    private Map<String, List<ObjectId>> travelPreferences;
    private LocalDateTime createdAt;
    private VerificationStatus verificationStatus = VerificationStatus.PENDING;

    // References
    private ObjectId permissionID;
    @Nullable private List<ObjectId> trips;


}
