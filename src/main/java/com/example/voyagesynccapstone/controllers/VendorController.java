package com.example.voyagesynccapstone.controllers;

import org.springframework.beans.factory.annotation.Autowired;
@RestController
@RequestMapping("/vendor")
public class VendorController {
    @Autowired
    private VendorService vendorService;

    @GetMapping("/{vendorID}")
    public ResponseEntity<Vendor> getVendorById(@PathVariable Long vendorID) {
        Vendor vendor = vendorService.getVendorById(vendorID);
        return ResponseEntity.ok(vendor);
    }

    @PostMapping("/assign-permission")
    public ResponseEntity<String> assignPermissionToVendor(
            @RequestParam Long vendorID, @RequestParam Long permissionID) {
        vendorService.assignPermission(vendorID, permissionID);
        return ResponseEntity.ok("Permission assigned successfully.");
    }
}
