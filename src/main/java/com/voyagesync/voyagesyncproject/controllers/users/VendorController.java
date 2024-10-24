package com.voyagesync.voyagesyncproject.controllers.users;

import com.voyagesync.voyagesyncproject.models.users.Vendors;
import com.voyagesync.voyagesyncproject.services.users.VendorService;
import org.bson.types.ObjectId;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/vendors")
public class VendorController {
    private final VendorService vendorService;

    public VendorController(final VendorService vendorService) {
        this.vendorService = vendorService;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllVendors() {
        List<Vendors> vendorsList = vendorService.getAllVendors();
        List<Map<String, Object>> response = vendorsList.stream().map(vendors -> {
            return createVendorMap(vendors);
        }).toList();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // New endpoint to filter vendors by name
    @GetMapping("/filter/name")
    public ResponseEntity<List<Map<String, Object>>> getVendorsByName(@RequestParam String businessName) {
        List<Vendors> vendorsList = vendorService.getVendorsByName(businessName);
        List<Map<String, Object>> response = vendorsList.stream().map(vendors -> {
            return createVendorMap(vendors);
        }).toList();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // New endpoint to filter vendors by type
    @GetMapping("/filter/type")
    public ResponseEntity<List<Map<String, Object>>> getVendorsByType(@RequestParam String businessType) {
        List<Vendors> vendorsList = vendorService.getVendorsByType(businessType);
        List<Map<String, Object>> response = vendorsList.stream().map(vendors -> {
            return createVendorMap(vendors);
        }).toList();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Helper method to create the vendor map
    private Map<String, Object> createVendorMap(Vendors vendors) {
        Map<String, Object> vendorMap = new LinkedHashMap<>();
        vendorMap.put("vendorId", vendors.getVendorId().toHexString());
        vendorMap.put("businessName", vendors.getBusinessName());
        vendorMap.put("businessRegistrationNumber", vendors.getBusinessRegistrationNumber());
        vendorMap.put("countryOfRegistration", vendors.getCountryOfRegistration());
        vendorMap.put("businessAddress", vendors.getBusinessAddress());
        vendorMap.put("businessPhoneNumber", vendors.getBusinessPhoneNumber());
        vendorMap.put("businessType", vendors.getBusinessType());
        vendorMap.put("industry", vendors.getIndustry());

        vendorMap.put("proofOfRegistration", vendors.getProofOfRegistration() != null ? vendors.getProofOfRegistration() : null);
        vendorMap.put("verificationStatus", vendors.getVerificationStatus());
        vendorMap.put("rejectionReason", vendors.getRejectionReason());
        vendorMap.put("representativeRole", vendors.getRepresentativeRole());
        vendorMap.put("representativeId", vendors.getRepresentativeId().toHexString());
        vendorMap.put("permissionAssignmentDate", vendors.getPermissionAssignmentDate());

        List<String> vendorPermissionIds = vendors.getVendorPermissions().stream()
                .map(ObjectId::toHexString).collect(Collectors.toList());
        vendorMap.put("vendorPermissions", vendorPermissionIds);

        vendorMap.put("bookings", vendors.getBookings() != null ?
                vendors.getBookings().stream().map(ObjectId::toHexString).collect(Collectors.toList()) : null);

        vendorMap.put("services", vendors.getServices() != null ?
                vendors.getServices().stream().map(ObjectId::toHexString).collect(Collectors.toList()) : null);

        return vendorMap;
    }
}
