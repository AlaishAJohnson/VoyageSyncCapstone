package com.voyagesync.voyagesyncproject.controllers.users;

import com.voyagesync.voyagesyncproject.models.users.TravelPreferences;
import com.voyagesync.voyagesyncproject.models.users.Users;
import com.voyagesync.voyagesyncproject.repositories.users.TravelPreferenceRepository;
import com.voyagesync.voyagesyncproject.services.users.TravelPreferenceService;
import com.voyagesync.voyagesyncproject.services.users.UsersService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/travel-preferences")
@CrossOrigin(origins = "http://localhost:8081")
public class TravelPreferencesController {
    private final TravelPreferenceService travelPreferenceService;
    private final UsersService usersService;
    private final TravelPreferenceRepository travelPreferenceRepository;

    public TravelPreferencesController(final TravelPreferenceService travelPreferenceService, final UsersService usersService, TravelPreferenceRepository travelPreferenceRepository) {
        this.travelPreferenceService = travelPreferenceService;
        this.usersService = usersService;
        this.travelPreferenceRepository = travelPreferenceRepository;
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
    public ResponseEntity<?> getPreferencesById(@PathVariable String id) {
        try {
            Optional<TravelPreferences> preferences = travelPreferenceService.findById(id);

            if (preferences.isPresent()) {
                Map<String, Object> response = mapPreferencesToResponse(preferences.get());
                return new ResponseEntity<>(response, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
            }
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



    @PutMapping("/user-preference/{userId}")
    public ResponseEntity<Map<String, Object>> updateTravelPreferences(@PathVariable String userId, @RequestBody TravelPreferences updatedPreferences) {
        try {
            // Fetch the user by userId
            Optional<Users> userOptional = usersService.findUserById(userId);
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found"));
            }

            Users user = userOptional.get();

            // Check if the user has a valid travelPreferences ObjectId
            if (user.getTravelPreferences() == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User has no linked travel preferences"));
            }

            String travelPreferencesId = user.getTravelPreferences().toString();

            Optional<TravelPreferences> preferencesOptional = travelPreferenceService.findById(travelPreferencesId);
            if (preferencesOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Travel Preferences not found"));
            }

            TravelPreferences preferences = preferencesOptional.get();

            preferences.setActivities(updatedPreferences.getActivities());
            preferences.setWeather(updatedPreferences.getWeather());
            preferences.setFood(updatedPreferences.getFood());

            travelPreferenceRepository.save(preferences);

            Map<String, Object> response = new HashMap<>();
            response.put("activities", preferences.getActivities());
            response.put("weather", preferences.getWeather());
            response.put("food", preferences.getFood());

            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(Map.of("error", "Failed to update travel preferences: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    private Map<String, Object> mapPreferencesToResponse(TravelPreferences preferences) {
        Map<String, Object> response = new HashMap<>();
        response.put("preferenceId", preferences.getPreferenceId().toHexString());
        response.put("activities", preferences.getActivities());
        response.put("food", preferences.getFood());
        response.put("weather", preferences.getWeather());
        return response;
    }
}
