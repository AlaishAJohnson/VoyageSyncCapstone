package com.voyagesync.voyagesyncproject.controllers.adminreports;

import java.util.Date;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;


@Document(collection = "Reports")
public class report {
    @Id
    private String reportId;
    private String adminId;
    private Date createdAt;
    private reportsDTO metrics;

    public String getReportId() {
        return reportId;
    }

    public void setReportId(String reportId) {
        this.reportId = reportId;
    }

    public String getAdminId() {
        return adminId;
    }

    public void setAdminId(String adminId) {
        this.adminId = adminId;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public reportsDTO getMetrics() {
        return metrics;
    }

    public void setMetrics(reportsDTO metrics) {
        this.metrics = metrics;
    }
}
