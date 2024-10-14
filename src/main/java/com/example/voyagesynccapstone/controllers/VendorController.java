package com.example.voyagesynccapstone.controllers;

import com.example.voyagesynccapstone.model.users.Vendors;
import com.example.voyagesynccapstone.services.VendorsService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vendors")
public class VendorController {

    @Autowired
    private VendorsService vendorsService;

    // Get all vendors
    @GetMapping
    public ResponseEntity<List<Vendors>> getAllVendors() {
        List<Vendors> vendors = vendorsService.getAllVendors();
        return ResponseEntity.ok(vendors);
    }

    // Get vendor by ID
    @GetMapping("/{vendorId}")
    public ResponseEntity<Vendors> getVendorById(@PathVariable ObjectId vendorId) {
        Vendors vendor = vendorsService.getVendorById(vendorId);
        return ResponseEntity.ok(vendor);
    }

    // Create a new vendor
    @PostMapping("/create")
    public ResponseEntity<Vendors> createVendor(@RequestBody Vendors vendor) {
        Vendors createdVendor = vendorsService.createVendor(vendor);
        return ResponseEntity.status(201).body(createdVendor);
    }

    // Delete a vendor by ID
    @DeleteMapping("/{vendorId}")
    public ResponseEntity<Void> deleteVendor(@PathVariable ObjectId vendorId) {
        vendorsService.deleteVendor(vendorId);
        return ResponseEntity.noContent().build();
    }
}
