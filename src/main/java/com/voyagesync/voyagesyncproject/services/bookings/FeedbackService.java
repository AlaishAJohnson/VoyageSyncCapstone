package com.voyagesync.voyagesyncproject.services.bookings;

import com.voyagesync.voyagesyncproject.models.bookings.Feedback;
import com.voyagesync.voyagesyncproject.repositories.bookings.FeedbackRepository;
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
}
