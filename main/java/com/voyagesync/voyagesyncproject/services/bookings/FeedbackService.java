package com.voyagesync.voyagesyncproject.services.bookings;

import com.voyagesync.voyagesyncproject.models.bookings.Feedback;
import com.voyagesync.voyagesyncproject.repositories.bookings.FeedbackRepository;
import com.voyagesync.voyagesyncproject.services.users.UsersService;
import com.voyagesync.voyagesyncproject.services.users.VendorService;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final UsersService usersService;  // Inject UsersService
    private final VendorService vendorService;  // Inject VendorService


    public FeedbackService(final FeedbackRepository feedbackRepository, UsersService usersService, VendorService vendorService) {
        this.feedbackRepository = feedbackRepository;
        this.usersService = usersService;
        this.vendorService = vendorService;
    }

    // Get all feedback
    public List<Feedback> getAllFeedback() {
        return feedbackRepository.findAll();
    }

    // Get feedback by vendor ID
    public List<Feedback> getFeedbackByVendorId(ObjectId vendorId) {
        return feedbackRepository.findByVendorId(vendorId);
    }

    // Get average rating for a vendor
    public double getAverageRatingByVendorId(ObjectId vendorId) {
        List<Feedback> feedbackList = getFeedbackByVendorId(vendorId);
        return feedbackList.stream()
                .mapToDouble(Feedback::getRating)
                .average()
                .orElse(0.0);
    }

    // Submit feedback for a vendor by a participant
    public Feedback submitFeedback(Feedback feedback) {
        // Check if the user exists
        if (!usersService.existsById(feedback.getUserId())) {
            throw new RuntimeException("User not found with ID: " + feedback.getUserId());
        }

        // Check if the vendor exists
        if (!vendorService.existsById(feedback.getVendorId())) {
            throw new RuntimeException("Vendor not found with ID: " + feedback.getVendorId());
        }

        // Set the feedback time if not set
        if (feedback.getFeedbackTime() == null) {
            feedback.setFeedbackTime(LocalDateTime.now());
        }

        // Save feedback to the repository
        return feedbackRepository.save(feedback);
    }
    public Feedback getFeedbackById(ObjectId feedbackId) {
        return feedbackRepository.findById(feedbackId).orElse(null);
    }


}
