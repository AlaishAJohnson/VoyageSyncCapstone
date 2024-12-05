package com.voyagesync.voyagesyncproject.controllers.vendorreports;

import com.voyagesync.voyagesyncproject.controllers.vendorreports.VendorReport;
import com.voyagesync.voyagesyncproject.controllers.vendorreports.VendorReportsDTO;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class VendorReportsService {

    @Autowired
    private MongoTemplate mongoTemplate;

    /**
     * Fetch vendor-specific metrics such as bookings, services, and feedback counts.
     *
     * @param vendorId The vendor's ID.
     * @return VendorReportsDTO with the metrics.
     */
    public VendorReportsDTO fetchVendorMetrics(String vendorId) {
        VendorReportsDTO metrics = new VendorReportsDTO();
        metrics.setBookingsCount(getBookingsCount(vendorId));
        metrics.setServicesCount(getServicesCount(vendorId));
        metrics.setFeedbackCount(getFeedbackCount(vendorId));
        return metrics;
    }

    /**
     * Save a new vendor report to the database.
     *
     * @param vendorId The vendor's ID.
     * @return The report ID of the saved report.
     */
    public String saveReport(String vendorId) {
        VendorReport vendorReport = new VendorReport();
        vendorReport.setReportId(UUID.randomUUID().toString());
        vendorReport.setVendorId(vendorId);
        vendorReport.setCreatedAt(new Date());

        VendorReportsDTO metrics = fetchVendorMetrics(vendorId);
        vendorReport.setMetrics(metrics);

        mongoTemplate.save(vendorReport, "VReports"); // Save to the correct collection
        return vendorReport.getReportId();
    }

    /**
     * Retrieve all reports for a specific vendor.
     *
     * @param vendorId The vendor's ID.
     * @return List of VendorReport objects.
     */
    public List<VendorReport> getVendorReports(String vendorId) {
        return mongoTemplate.find(
                org.springframework.data.mongodb.core.query.Query.query(
                        org.springframework.data.mongodb.core.query.Criteria.where("vendorId").is(vendorId)
                ),
                VendorReport.class,
                "VReports"
        );
    }

    // Private helper methods for metrics calculations

    private int getBookingsCount(String vendorId) {
        return (int) mongoTemplate.getCollection("Bookings")
                .countDocuments(new org.bson.Document("vendorId", vendorId));
    }

    private int getServicesCount(String vendorId) {
        return (int) mongoTemplate.getCollection("Services")
                .countDocuments(new org.bson.Document("vendorId", vendorId));
    }

    private int getFeedbackCount(String vendorId) {
        return (int) mongoTemplate.getCollection("Feedback")
                .countDocuments(new org.bson.Document("vendorId", vendorId));
    }
}
