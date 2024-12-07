package com.voyagesync.voyagesyncproject.services.users;

import com.voyagesync.voyagesyncproject.models.bookings.Bookings;
import com.voyagesync.voyagesyncproject.models.users.Users;
import com.voyagesync.voyagesyncproject.models.users.Vendors;
import com.voyagesync.voyagesyncproject.repositories.users.VendorRepository;
import com.voyagesync.voyagesyncproject.services.bookings.BookingService;  // Import BookingService
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class VendorService {

    private final UsersService usersService;
    private final VendorRepository vendorRepository;
    private final BookingService bookingService;  // Declare BookingService

    public VendorService(final VendorRepository vendorRepository, final BookingService bookingService, final UsersService usersService) {
        this.vendorRepository = vendorRepository;
        this.bookingService = bookingService;
        this.usersService = usersService;  // Initialize UsersService
    }

    public List<Vendors> getAllVendors() {
        return vendorRepository.findAll();
    }

    public void createVendor(Vendors newVendor, ObjectId representativeId) {
        newVendor.setRepresentativeId(representativeId); // Link userId to representativeId
        vendorRepository.save(newVendor);
    }


    public Vendors getVendorById(ObjectId vendorId) {

        return vendorRepository.findById(vendorId).orElse(null);
    }

    // Method to get vendors by business name
    public List<Vendors> getVendorsByName(String businessName) {
        return vendorRepository.findByBusinessName(businessName);
    }

    public Vendors getVendorByRepresentativeId(ObjectId representativeId) {
        return vendorRepository.findByRepresentativeId(representativeId)
                .orElseThrow(() -> new IllegalArgumentException("Vendor not found for user ID: " + representativeId));
    }



    // Method to get vendors by business type
    public List<Vendors> getVendorsByType(String businessType) {
        return vendorRepository.findByBusinessType(businessType);
    }

    public List<Vendors> getVendorsByIndustry(String industry) {
        return vendorRepository.findByIndustry(industry);
    }

    public List<ObjectId> getServiceIdByIndustry(String industry) {
        List<Vendors> vendors = vendorRepository.findByIndustry(industry);
        List<ObjectId> serviceIds = new ArrayList<>();
        for (Vendors vendor : vendors) {
            serviceIds.addAll(vendor.getServices());
        }
        return serviceIds;
    }

    // New method to fetch bookings for a specific vendor
    public List<Bookings> getBookingsForVendor(ObjectId vendorId) {
        // Ensure vendorId is queried as ObjectId
        return bookingService.getByVendorId(vendorId);
    }


    // Method to check if a vendor exists by vendorId
    public boolean existsById(ObjectId vendorId) {

        return vendorRepository.existsById(vendorId);
    }

    public boolean updateVendor(ObjectId vendorId, Map<String, Object> updatedData) {
        Vendors vendor = vendorRepository.findById(vendorId).orElse(null);

        if (vendor == null) {
            return false;
        }

        // Check if the vendor's userId (representativeId) exists in the Users collection
        Users user = usersService.getUserById(vendor.getRepresentativeId().toString());
        if (user != null) {

            // Update vendor fields
            if (updatedData.containsKey("businessName")) {
                vendor.setBusinessName((String) updatedData.get("businessName"));
            }
            if (updatedData.containsKey("businessPhoneNumber")) {
                vendor.setBusinessPhoneNumber((String) updatedData.get("businessPhoneNumber"));
            }
            if (updatedData.containsKey("email")) {
                vendor.setEmail((String) updatedData.get("email"));
                // Also update email in Users collection
                user.setEmail((String) updatedData.get("email"));
            }
            if (updatedData.containsKey("username")) {
                vendor.setUsername((String) updatedData.get("username"));
                // Also update username in Users collection
                user.setUsername((String) updatedData.get("username"));
            }
            if (updatedData.containsKey("password")) {
                String password = (String) updatedData.get("password");
                // Only update the password if it's non-null and not empty
                if (password != null && !password.isEmpty()) {
                    vendor.setPassword(password);
                    // Also update password in Users collection
                    user.setPassword(password);
                }
            }

            // Save both vendor and user changes
            vendorRepository.save(vendor);
            usersService.updateUser(user);
            return true;
        }

        return false;
    }

}
