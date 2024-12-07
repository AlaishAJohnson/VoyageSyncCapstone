package com.voyagesync.voyagesyncproject.controllers.vendorreports;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.Date;
import java.util.List;

@CrossOrigin(origins = "http://localhost:8081")
@RestController
@RequestMapping("/api")
public class VendorReportsController {

    @Autowired
    private VendorReportsService vendorReportsService;

    // vendorId as a query parameter
    @GetMapping("/metrics")
    public ResponseEntity<?> getVendorMetrics(@RequestParam("vendorId") String vendorId) {
        try {
            VendorReportsDTO metrics = vendorReportsService.fetchVendorMetrics(vendorId);
            if (metrics == null) {
                return ResponseEntity.status(404).body("Vendor not found or no metrics available.");
            }
            return ResponseEntity.ok(metrics);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching metrics: " + e.getMessage());
        }
    }

    // vendorId as a path variable
    @PostMapping("/generate/{vendorId}")
    public ResponseEntity<?> generateVendorReport(@PathVariable("vendorId") String vendorId) {
        try {
            VendorReport vendorReport = vendorReportsService.generateVendorReport(vendorId);
            if (vendorReport == null) {
                return ResponseEntity.status(404).body("Report generation failed.");
            }
            return ResponseEntity.ok(vendorReport);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error generating report: " + e.getMessage());
        }
    }

    // vendorId passed as query parameter
    @GetMapping("/vendor-reports")
    public ResponseEntity<?> getVendorReports(@RequestParam("vendorId") String vendorId) {
        try {
            List<VendorReport> vendorReports = vendorReportsService.getVendorReports(vendorId);
            return ResponseEntity.ok(vendorReports);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching vendor reports: " + e.getMessage());
        }
    }
}
