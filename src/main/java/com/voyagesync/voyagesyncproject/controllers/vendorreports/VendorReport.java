package com.voyagesync.voyagesyncproject.controllers.vendorreports;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;

@Getter
@Setter

@Document(collection = "VReports")
public class VendorReport {
    @Id
    private String reportId;  // The unique ID for this vendor report
    private String vendorId;  // Vendor ID, linked to the vendor collection
    private Date createdAt;   // Date when the report was created
    private VendorReportsDTO metrics; // Metrics for the vendor (bookingsCount, servicesCount, feedbackCount)

    public String getReportId() {
        return reportId;
    }

    public void setReportId(String reportId) {
        this.reportId = reportId;
    }

    public String getVendorId() {
        return vendorId;
    }

    public void setVendorId(String vendorId) {
        this.vendorId = vendorId;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public VendorReportsDTO getMetrics() {
        return metrics;
    }

    public void setMetrics(VendorReportsDTO metrics) {
        this.metrics = metrics;
    }
}
