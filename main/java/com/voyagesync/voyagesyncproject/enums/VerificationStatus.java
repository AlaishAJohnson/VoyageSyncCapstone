package com.voyagesync.voyagesyncproject.enums;

public enum VerificationStatus {
    PENDING,
    VERIFIED,
    REJECTED;

    public static VerificationStatus fromString(String status) {
        return VerificationStatus.valueOf(status.toUpperCase());
    }
}
