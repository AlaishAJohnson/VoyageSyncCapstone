package com.example.voyagesynccapstone.services;

import com.example.voyagesynccapstone.interfaces.users.VendorRepository;
import com.example.voyagesynccapstone.model.users.Vendors;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

public class VendorsService {
    @Autowired
    private VendorRepository vendorRepository;

    public List<Vendors> getAllVendors() {
        return vendorRepository.findAll();
    }

    public Vendors getVendorById(ObjectId vendorId) {
        return vendorRepository.findById(vendorId)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found with id " + vendorId));
    }

    public Vendors createVendor(Vendors vendor) {
        return vendorRepository.save(vendor);
    }

    public void deleteVendor(ObjectId vendorId) {
        vendorRepository.deleteById(vendorId);
    }
}
