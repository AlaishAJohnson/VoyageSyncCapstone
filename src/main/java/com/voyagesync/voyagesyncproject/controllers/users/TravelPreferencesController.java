package com.voyagesync.voyagesyncproject.controllers.users;

import com.voyagesync.voyagesyncproject.models.users.TravelPreferences;
import com.voyagesync.voyagesyncproject.services.users.TravelPreferenceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/travel-preferences")
public class TravelPreferencesController {
    private final TravelPreferenceService travelPreferenceService;
    public TravelPreferencesController(final TravelPreferenceService travelPreferenceService) {
        this.travelPreferenceService = travelPreferenceService;
    }

    @PostMapping("/savePreferences")
    public ResponseEntity<TravelPreferences> savePreferences(@RequestBody TravelPreferences preferences) {
        try {

            TravelPreferences savedPreferences = travelPreferenceService.savePreferences(preferences);

            return ResponseEntity.ok(savedPreferences);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> createTravelPreference(@RequestBody Map<String, Object> preferenceDetails) {
        try {
            // Get the data from the request body (as Strings)
            List<String> activities = (List<String>) preferenceDetails.get("activities");
            List<String> food = (List<String>) preferenceDetails.get("food");
            List<String> weather = (List<String>) preferenceDetails.get("weather");

            // Check if required fields are present
            if (activities == null || food == null || weather == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Missing required fields"));
            }

            // Create the TravelPreferences object
            TravelPreferences newPreference = new TravelPreferences();
            newPreference.setActivities(activities);
            newPreference.setFood(food);
            newPreference.setWeather(weather);

            // Save the TravelPreference
            TravelPreferences savedPreference = travelPreferenceService.createTravelPreference(newPreference);

            // Return success response with the created preferenceId
            return new ResponseEntity<>(Map.of("message", "Travel preference created successfully",
                    "preferenceId", savedPreference.getPreferenceId().toString()),
                    HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to create travel preference: " + e.getMessage()));
        }
    }


    @GetMapping("/{id}")
    public ResponseEntity<TravelPreferences> getPreferencesById(@PathVariable String id) {
        try {
            Optional<TravelPreferences> preferences = travelPreferenceService.findById(id);
            return preferences.map(travelPreferences -> new ResponseEntity<>(travelPreferences, HttpStatus.OK)).orElseGet(() -> new ResponseEntity<>(null, HttpStatus.NOT_FOUND));
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<TravelPreferences> updatePreferences(@PathVariable String id, @RequestBody TravelPreferences updatedPreferences) {
        try {
            Optional<TravelPreferences> preferences = travelPreferenceService.findById(id);
            if (preferences.isPresent()) {
                TravelPreferences updated = travelPreferenceService.updatePreferences(id, updatedPreferences);
                return new ResponseEntity<>(updated, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
