package com.voyagesync.voyagesyncproject.models.users;

import com.voyagesync.voyagesyncproject.enums.VerificationStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Document(collection = "Vendor")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vendors {
    @Id
    private ObjectId vendorId;
    @Field("businessName")
    private String businessName;
    @Field("businessRegistrationNumber")
    private String businessRegistrationNumber;
    @Field("countryOfRegistration")
    private String countryOfRegistration;
    @Field("businessAddress")
    private String businessAddress;
    @Field("businessPhoneNumber")
    private String businessPhoneNumber;
    @Field("businessType")
    private String businessType;
    @Field("industry")
    private String industry;
    @Field("proofOfRegistration")
    private byte[] proofOfRegistration;
    @Field("verificationStatus")
    private VerificationStatus verificationStatus = VerificationStatus.PENDING;
    @Field("rejectionReason")
    private String rejectionReason;

    // Representative Information
    @Field("representativeRole")
    private String representativeRole;
    @Field("representativeId")
    private ObjectId representativeId;

    // Permission Information
    @Field("permissionAssignmentDate")
    private LocalDateTime permissionAssignmentDate;
    @Field("vendorPermissions")
    private List<ObjectId> vendorPermissions;
    @Field("bookings")
    private List<ObjectId> bookings;
    @Field("services")
    private List<ObjectId> services;



}
