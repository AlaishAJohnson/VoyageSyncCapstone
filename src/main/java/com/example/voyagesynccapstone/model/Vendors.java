package com.example.voyagesynccapstone.model;

import com.mongodb.lang.Nullable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "vendors")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vendors {

    @Id
    private ObjectId vendorID;
    private String vendorName;
    private String vendorRegistrationNumber;
    private String countryOfRegistration;
    private String vendorAddress;
    private String phoneNumber;
    private String businessType;
    private String industry;
    private String proofOfRegistration;
    private VerificationStatus verificationStatus = VerificationStatus.PENDING;
    private LocalDateTime verificationDate;
    @Nullable private String rejectionReason;
    private String representativeRole;

    // References
    private ObjectId representativeID;
    private ObjectId permissionID;


}
