package com.voyagesync.voyagesyncproject.services.users;

import com.voyagesync.voyagesyncproject.models.users.Vendors;
import com.voyagesync.voyagesyncproject.repositories.users.VendorRepository;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class VendorService {

    private final VendorRepository vendorRepository;
    public VendorService(final VendorRepository vendorRepository) {
        this.vendorRepository = vendorRepository;
    }

    public List<Vendors> getAllVendors() {
        return vendorRepository.findAll();
    }
    public void createVendor(Vendors newVendor) {
        vendorRepository.save(newVendor);
    }

    public Vendors getVendorById(ObjectId vendorId) {
        // Log the vendorId received
        System.out.println("Vendor ID received in Service: " + vendorId);
        return vendorRepository.findById(vendorId).orElse(null);
    }
    // Method to get vendors by business name
    public List<Vendors> getVendorsByName(String businessName) {
        return vendorRepository.findByBusinessName(businessName);
    }

    public Vendors getVendorByRepresentativeId(ObjectId userId) {
        return vendorRepository.findByRepresentativeId(userId).orElse(null);
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
    // Method to check if a vendor exists by vendorId
    public boolean existsById(ObjectId vendorId) {
        return vendorRepository.existsById(vendorId);
    }

}
