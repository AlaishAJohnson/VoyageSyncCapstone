package com.voyagesync.voyagesyncproject.controllers.vendorreports;

import java.util.Date;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@Document(collection = "VReports")
public class VendorReport {

    @Id
    private String _id;
    private String vendorId;
    private Date createdAt;
    private VendorReportsDTO metrics;

    // Getters and Setters
    public String get_id() {
        return _id;
    }

    public void set_id(String _id) {
        this._id = _id;
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
