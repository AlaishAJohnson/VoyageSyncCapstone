package com.voyagesync.voyagesyncproject.controllers.vendorreports;

import com.voyagesync.voyagesyncproject.controllers.vendorreports.VendorReportsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.Date;
import java.util.List;

@CrossOrigin(origins = "http://localhost:8081")
@RestController
@RequestMapping("/api/vendor-reports")
public class VendorReportsController {

    @Autowired
    private VendorReportsService vendorReportsService;

    @GetMapping("/metrics")
    public ResponseEntity<VendorReportsDTO> getVendorMetrics(@RequestAttribute("vendorId") String vendorId) {
        // Fetch vendor-specific metrics
        VendorReportsDTO metrics = vendorReportsService.fetchVendorMetrics(vendorId);
        return ResponseEntity.ok(metrics);
    }

    @PostMapping("/generate")
    public ResponseEntity<VendorReport> generateVendorReport(@RequestAttribute("vendorId") String vendorId) {
        // Generate a new vendor report
        String reportId = vendorReportsService.saveReport(vendorId);

        // Fetch metrics for the vendor
        VendorReportsDTO metrics = vendorReportsService.fetchVendorMetrics(vendorId);

        // Create a VendorReport object
        VendorReport vendorReport = new VendorReport();
        vendorReport.setReportId(reportId);
        vendorReport.setVendorId(vendorId);
        vendorReport.setMetrics(metrics);
        vendorReport.setCreatedAt(new Date());

        return ResponseEntity.ok(vendorReport);
    }

    @GetMapping
    public ResponseEntity<List<VendorReport>> getVendorReports(@RequestAttribute("vendorId") String vendorId) {
        // Get all reports for the specific vendor
        List<VendorReport> vendorReports = vendorReportsService.getVendorReports(vendorId);
        return ResponseEntity.ok(vendorReports);
    }
}
