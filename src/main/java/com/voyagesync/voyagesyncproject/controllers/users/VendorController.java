package com.voyagesync.voyagesyncproject.controllers.users;

import com.voyagesync.voyagesyncproject.models.users.Vendors;
import com.voyagesync.voyagesyncproject.services.users.VendorService;
import org.bson.types.ObjectId;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
    public ResponseEntity<List<Map<String, Object>>> getAllVendors(){
        List<Vendors> vendorsList = vendorService.getAllVendors();
        List<Map<String, Object>> response = vendorsList.stream().map(vendors -> {
            Map<String, Object> vendorMap = new LinkedHashMap<>();
            vendorMap.put("vendorId", vendors.getVendorId().toHexString());
            vendorMap.put("businessName", vendors.getBusinessName());

            vendorMap.put("businessRegistrationNumber", vendors.getBusinessRegistrationNumber());
            vendorMap.put("countryOfRegistration", vendors.getCountryOfRegistration());
            vendorMap.put("businessAddress", vendors.getBusinessAddress());
            vendorMap.put("businessPhoneNumber", vendors.getBusinessPhoneNumber());
            vendorMap.put("businessType", vendors.getBusinessType());
            vendorMap.put("industry", vendors.getIndustry());


            if(vendors.getProofOfRegistration() != null) {
                vendorMap.put("proofOfRegistration", vendors.getProofOfRegistration());
            } else {
                vendorMap.put("proofOfRegistration", null);
            }

            vendorMap.put("verificationStatus", vendors.getVerificationStatus());
            vendorMap.put("rejectionReason", vendors.getRejectionReason());
            vendorMap.put("representativeRole", vendors.getRepresentativeRole());
            vendorMap.put("representativeId", vendors.getRepresentativeId().toHexString());
            vendorMap.put("permissionAssignmentDate", vendors.getPermissionAssignmentDate());

            List<String> vendorPermissionIds = vendors.getVendorPermissions().stream()
                    .map(ObjectId::toHexString).collect(Collectors.toList());
            vendorMap.put("vendorPermissions", vendorPermissionIds);

            if(vendors.getBookings() != null) {
                List<String> bookingIds = vendors.getBookings().stream().map(ObjectId::toHexString).collect(Collectors.toList());
                vendorMap.put("bookings", bookingIds);
            } else {
                vendorMap.put("bookings", null);
            }

            if(vendors.getServices() != null) {
                List<String> serviceIds = vendors.getServices().stream().map(ObjectId::toHexString).collect(Collectors.toList());
                vendorMap.put("services", serviceIds);
            } else {
                vendorMap.put("services", null);
            }

            return vendorMap;
        }).toList();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
