package com.voyagesync.voyagesyncproject.services.bookings;

import com.voyagesync.voyagesyncproject.models.bookings.Feedback;
import com.voyagesync.voyagesyncproject.repositories.bookings.FeedbackRepository;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FeedbackService {
    private final FeedbackRepository feedbackRepository;
    public FeedbackService(final FeedbackRepository feedbackRepository) {
        this.feedbackRepository = feedbackRepository;
    }

    public List<Feedback> getAllFeedback(){
        return feedbackRepository.findAll();
    }

    public List<Feedback> getFeedbackByVendorId(ObjectId vendorId) {
        return feedbackRepository.findByVendorId(vendorId);
    }

    public double getAverageRatingByVendorId(ObjectId vendorId) {
        List<Feedback> feedbackList = getFeedbackByVendorId(vendorId);
        return feedbackList.stream()
                .mapToDouble(Feedback::getRating)
                .average()
                .orElse(0.0);
    }


}
