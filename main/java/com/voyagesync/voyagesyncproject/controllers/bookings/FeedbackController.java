package com.voyagesync.voyagesyncproject.controllers.bookings;

import com.voyagesync.voyagesyncproject.models.bookings.Feedback;
import com.voyagesync.voyagesyncproject.services.bookings.FeedbackService;
import com.voyagesync.voyagesyncproject.services.users.UsersService;
import com.voyagesync.voyagesyncproject.services.users.VendorService;
import org.bson.types.ObjectId;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.LinkedHashMap;

@RestController
@RequestMapping("/api/vendors/feedback")
@CrossOrigin(origins = "http://localhost:8081")
public class FeedbackController {

    private final FeedbackService feedbackService;
    private final UsersService usersService;
    private final VendorService vendorService;

    public FeedbackController(final FeedbackService feedbackService,
                              final UsersService usersService,
                              final VendorService vendorService) {
        this.feedbackService = feedbackService;
        this.usersService = usersService;
        this.vendorService = vendorService;
    }

    // Helper method to convert Feedback to Map
    private Map<String, Object> mapFeedbackToMap(Feedback feedback) {
        Map<String, Object> feedbackMap = new LinkedHashMap<>();
        feedbackMap.put("feedbackId", feedback.getFeedbackId());
        feedbackMap.put("userId", feedback.getUserId());
        feedbackMap.put("vendorId", feedback.getVendorId());
        feedbackMap.put("rating", feedback.getRating());
        feedbackMap.put("feedbackComment", feedback.getFeedbackComment());
        feedbackMap.put("feedbackTime", feedback.getFeedbackTime());
        feedbackMap.put("isAnonymous", feedback.isAnonymous());
        return feedbackMap;
    }

    // Get all feedback
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllFeedback() {
        List<Feedback> feedbackList = feedbackService.getAllFeedback();
        List<Map<String, Object>> response = feedbackList.stream()
                .map(this::mapFeedbackToMap)
                .toList();

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Submit feedback
    @PostMapping("/new")
    public ResponseEntity<Map<String, Object>> submitFeedback(@RequestBody Feedback feedback) {
        // Check if the user is a participant
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!usersService.isUserParticipant(username)) {
            return new ResponseEntity<>(Map.of("error", "Only participants can leave feedback"), HttpStatus.FORBIDDEN);
        }

        // Validate vendorId
        if (vendorService.getVendorById(feedback.getVendorId()) == null) {
            return new ResponseEntity<>(Map.of("error", "Invalid vendor ID"), HttpStatus.BAD_REQUEST);
        }

        // Set userId and feedback time before saving
        feedback.setUserId(usersService.getByUsername(username).getId());
        feedback.setFeedbackTime(LocalDateTime.now());

        // Save the feedback
        Feedback savedFeedback = feedbackService.submitFeedback(feedback);

        // Prepare response
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("message", "Feedback submitted successfully");
        response.put("feedbackId", savedFeedback.getFeedbackId());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // Get feedback by feedbackId
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getFeedbackById(@PathVariable("id") ObjectId feedbackId) {
        Feedback feedback = feedbackService.getFeedbackById(feedbackId);
        if (feedback == null) {
            return new ResponseEntity<>(Map.of("error", "Feedback not found"), HttpStatus.NOT_FOUND);
        }

        Map<String, Object> feedbackMap = mapFeedbackToMap(feedback);
        return new ResponseEntity<>(feedbackMap, HttpStatus.OK);
    }

    // Get feedback by vendorId
    @GetMapping("/vendor/{vendorId}")
    public ResponseEntity<List<Map<String, Object>>> getFeedbackByVendorId(@PathVariable ObjectId vendorId) {
        List<Feedback> feedbackList = feedbackService.getFeedbackByVendorId(vendorId);
        if (feedbackList.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        List<Map<String, Object>> response = feedbackList.stream()
                .map(this::mapFeedbackToMap)
                .toList();

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
