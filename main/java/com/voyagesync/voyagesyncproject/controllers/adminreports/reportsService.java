package com.voyagesync.voyagesyncproject.controllers.adminreports;

import org.springframework.stereotype.Service;

import java.util.UUID;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;


@Service
public class reportsService {

    @Autowired
    private MongoTemplate mongoTemplate;

    public reportsDTO fetchPlatformUsage() {
        reportsDTO usageData = new reportsDTO();
        usageData.setUserCount(getUserCount());
        usageData.setTripCount(getTripCount());
        usageData.setBookingCount(getBookingCount());
        usageData.setFeedbackCount(getFeedbackCount());
        return usageData;
    }

    public String saveReport(String adminId) {
        report report = new report();
        report.setReportId(UUID.randomUUID().toString());
        report.setAdminId(adminId);
        report.setCreatedAt(new Date());

        reportsDTO metrics = fetchPlatformUsage();
        report.setMetrics(metrics);

        mongoTemplate.save(report);
        return report.getReportId();
    }

    public List<report> getReports() {
        return mongoTemplate.findAll(report.class);
    }

    private long getUserCount() {
        return mongoTemplate.getCollection("Users").countDocuments();
    }

    private long getTripCount() {
        return mongoTemplate.getCollection("Trip").countDocuments();
    }

    private long getBookingCount() {
        return mongoTemplate.getCollection("Bookings").countDocuments();
    }

    private long getFeedbackCount() {
        return mongoTemplate.getCollection("Feedback").countDocuments();
    }
}

