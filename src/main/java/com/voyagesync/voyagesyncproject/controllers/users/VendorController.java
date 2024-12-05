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
@CrossOrigin(origins = "http://localhost:8081")
public class VendorController {
    private final VendorService vendorService;

    public VendorController(final VendorService vendorService) {
        this.vendorService = vendorService;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllVendors() {
        List<Vendors> vendorsList = vendorService.getAllVendors();
        List<Map<String, Object>> response = vendorsList.stream().map(this::mapVendorsToResponse).collect(Collectors.toList());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/by-user/{userId}")
    public ResponseEntity<Map<String, Object>> getVendorByUserId(@PathVariable String userId) {
        try {
            // Convert userId (String) to ObjectId
            ObjectId userObjectId = new ObjectId(userId);

            Vendors vendor = vendorService.getVendorByRepresentativeId(userObjectId);
            return new ResponseEntity<>(mapVendorsToResponse(vendor), HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/{vendorId}")
    public ResponseEntity<Map<String, Object>> getVendorById(@PathVariable String vendorId) {
        try {
            ObjectId objectId = new ObjectId(vendorId); // Convert String to ObjectId
            Vendors vendor = vendorService.getVendorById(objectId); // Pass ObjectId to the service
            if (vendor == null) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND); // Vendor not found
            }
            return new ResponseEntity<>(mapVendorsToResponse(vendor), HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            // Handle invalid ObjectId format
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    // New endpoint to filter vendors by name
    @GetMapping("/filter/name/{businessName}")
    public ResponseEntity<List<Map<String, Object>>> getVendorsByName(@PathVariable String businessName) {
        List<Vendors> vendorsList = vendorService.getVendorsByName(businessName);
        List<Map<String, Object>> response = vendorsList.stream().map(this::mapVendorsToResponse).collect(Collectors.toList());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // New endpoint to filter vendors by type
    @GetMapping("/filter/type/{businessType}")
    public ResponseEntity<List<Map<String, Object>>> getVendorsByType(@PathVariable String businessType) {
        List<Vendors> vendorsList = vendorService.getVendorsByType(businessType);
        List<Map<String, Object>> response = vendorsList.stream().map(this::mapVendorsToResponse).collect(Collectors.toList());
                return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/industry")
    public ResponseEntity<List<Map<String, Object>>> getVendorsByIndustry(@RequestParam String industry) {
        List<Vendors> vendors = vendorService.getVendorsByIndustry(industry);
        List<Map<String, Object>> response = vendors.stream().map(this::mapVendorsToResponse).collect(Collectors.toList());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Helper method to create the vendor map
    private Map<String, Object> mapVendorsToResponse(Vendors vendors) {
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

        vendorMap.put("bookings", vendorService.getBookingsForVendor(vendors.getVendorId()).stream()
                .map(booking -> booking.getBookingId().toHexString()).collect(Collectors.toList()));

        vendorMap.put("services", vendors.getServices() != null ?
                vendors.getServices().stream().map(ObjectId::toHexString).collect(Collectors.toList()) : null);

        return vendorMap;
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateVendorProfile(@RequestBody Map<String, Object> updatedData) {
        try {
            String vendorId = (String) updatedData.get("vendorId");
            ObjectId vendorObjectId = new ObjectId(vendorId);

            boolean isUpdated = vendorService.updateVendor(vendorObjectId, updatedData);

            if (isUpdated) {
                return new ResponseEntity<>("Vendor profile updated successfully", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Vendor not found", HttpStatus.NOT_FOUND);
            }
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>("Invalid vendor ID format", HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Error updating vendor profile", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
