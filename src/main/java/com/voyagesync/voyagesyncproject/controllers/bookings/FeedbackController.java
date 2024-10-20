package com.voyagesync.voyagesyncproject.controllers.bookings;


import com.voyagesync.voyagesyncproject.models.bookings.Feedback;
import com.voyagesync.voyagesyncproject.services.bookings.FeedbackService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/vendors/feedback")
public class FeedbackController {
    private final FeedbackService feedbackService;
    public FeedbackController(final FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllFeedback() {
        List<Feedback> feedbackList = feedbackService.getAllFeedback();
        List<Map<String, Object>> response = feedbackList.stream().map(feedback -> {
            Map<String, Object> feedbackMap = new LinkedHashMap<>();
            feedbackMap.put("feedbackId", feedback.getFeedbackId());
            feedbackMap.put("userId", feedback.getUserId());
            feedbackMap.put("vendorId", feedback.getVendorId());
            feedbackMap.put("rating", feedback.getRating());
            feedbackMap.put("feedbackComment", feedback.getFeedbackComment());
            feedbackMap.put("feedbackTime", feedback.getFeedbackTime());
            feedbackMap.put("isAnonymous", feedback.isAnonymous());
            return feedbackMap;
        }).toList();

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
