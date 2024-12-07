package com.voyagesync.voyagesyncproject.controllers.adminreports;

import com.voyagesync.voyagesyncproject.models.users.Admins;
import com.voyagesync.voyagesyncproject.services.users.AdminService;
import com.voyagesync.voyagesyncproject.controllers.adminreports.reportsDTO;
import org.bson.types.ObjectId;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.Date;
import java.time.format.DateTimeFormatter;

@CrossOrigin(origins = "http://localhost:8081")
@RestController
@RequestMapping("/api/reports")
public class reportsController {
    @Autowired
    private reportsService reportsService;

    @GetMapping("/platform-usage")
    public ResponseEntity<reportsDTO> getPlatformUsage() {
        reportsDTO platformUsage = reportsService.fetchPlatformUsage();
        return ResponseEntity.ok(platformUsage);
    }

    /* 
    @PostMapping("/generate")
    public ResponseEntity<String> generateReport(@RequestAttribute("adminId") ObjectId adminId) {
        String reportId = reportsService.saveReport(adminId.toString());
        return ResponseEntity.ok("Report generated with ID: " + reportId);
    }
    */

    @PostMapping("/generate")
    public ResponseEntity<report> generateReport() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String adminId = authentication.getName();

        //ObjectId adminId = new ObjectId();
        String reportId = reportsService.saveReport(adminId.toString());

        reportsDTO metrics = reportsService.fetchPlatformUsage();

        report reportX = new report();
        reportX.setReportId(reportId);
        reportX.setAdminId(adminId.toString());
        reportX.setMetrics(metrics);
        reportX.setCreatedAt(new Date());
        return ResponseEntity.ok(reportX);
    }

    @GetMapping
    public ResponseEntity<List<report>> getReports() {
        return ResponseEntity.ok(reportsService.getReports());
    }
}
