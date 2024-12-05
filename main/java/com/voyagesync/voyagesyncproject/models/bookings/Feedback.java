package com.voyagesync.voyagesyncproject.models.bookings;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.TypeAlias;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "Feedback")
@TypeAlias("")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Feedback {
    @Id
    private ObjectId feedbackId;
    private ObjectId userId;
    private ObjectId vendorId;
    private double rating;
    private String feedbackComment;
    private LocalDateTime feedbackTime;
    private boolean isAnonymous = false;
}
