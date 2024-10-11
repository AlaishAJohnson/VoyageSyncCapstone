package com.example.voyagesynccapstone.model;


import lombok.*;
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
    private String userID;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String phoneNumber;
    private String role;
    private Map<String, List<String>> travelPreferences;
    private LocalDateTime createdAt;
    private VerificationStatus verificationStatus = VerificationStatus.PENDING;

    // References
    private String permissionID;
    private List<String> trips;

    public enum VerificationStatus {
        PENDING,
        VERIFIED,
        REJECTED
    }
}
