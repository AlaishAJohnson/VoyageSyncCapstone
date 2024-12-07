package com.voyagesync.voyagesyncproject.controllers.vendorreports;

import org.bson.types.ObjectId;
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
     * Generate and save a new vendor report to the database.
     *
     * @param vendorId The vendor's ID.
     * @return The generated VendorReport object.
     */
    public VendorReport generateVendorReport(String vendorId) {
        VendorReport vendorReport = new VendorReport();
        vendorReport.set_id(UUID.randomUUID().toString());
        vendorReport.setVendorId(vendorId);
        vendorReport.setCreatedAt(new Date());

        VendorReportsDTO metrics = fetchVendorMetrics(vendorId);
        vendorReport.setMetrics(metrics);

        mongoTemplate.save(vendorReport, "VReports"); // Save to the correct collection
        return vendorReport;
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
        return (int) mongoTemplate.count(
                org.springframework.data.mongodb.core.query.Query.query(
                        org.springframework.data.mongodb.core.query.Criteria.where("vendorId").is(new ObjectId(vendorId))
                ),
                "Bookings"
        );
    }
    private int getServicesCount(String vendorId) {
        return (int) mongoTemplate.count(
                org.springframework.data.mongodb.core.query.Query.query(
                        org.springframework.data.mongodb.core.query.Criteria.where("vendorId").is(new ObjectId(vendorId))
                ),
                "Services"
        );
    }

    private int getFeedbackCount(String vendorId) {
        return (int) mongoTemplate.count(
                org.springframework.data.mongodb.core.query.Query.query(
                        org.springframework.data.mongodb.core.query.Criteria.where("vendorId").is(new ObjectId(vendorId))
                ),
                "Feedback"
        );
    }
}
