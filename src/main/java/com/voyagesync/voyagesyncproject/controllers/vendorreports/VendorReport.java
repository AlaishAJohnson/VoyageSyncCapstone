package com.voyagesync.voyagesyncproject.controllers.vendorreports;

import java.util.Date;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;



@Document(collection = "VReports")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VendorReport {
    @Id
    private String reportId;
    private String vendorId;
    private Date createdAt;
    private VendorReportsDTO metrics;

}
