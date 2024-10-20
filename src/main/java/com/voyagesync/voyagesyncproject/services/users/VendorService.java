package com.voyagesync.voyagesyncproject.services.users;

import com.voyagesync.voyagesyncproject.models.users.Vendors;
import com.voyagesync.voyagesyncproject.repositories.users.VendorRepository;
import org.springframework.stereotype.Service;

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
}
