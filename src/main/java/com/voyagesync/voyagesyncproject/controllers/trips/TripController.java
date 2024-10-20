package com.voyagesync.voyagesyncproject.controllers.trips;

import com.voyagesync.voyagesyncproject.models.trips.Trips;
import com.voyagesync.voyagesyncproject.services.trips.TripService;
import org.bson.types.ObjectId;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/trips")
public class TripController {
    private final TripService tripService;
    public TripController(final TripService tripService) {
        this.tripService = tripService;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllTrips() {
        List<Trips> tripsList = tripService.getAllTrips();
        List<Map<String, Object>> response = tripsList.stream().map(trips -> {

            Map<String, Object> tripMap = new LinkedHashMap<>();
            tripMap.put("tripId", trips.getTripId().toHexString());
            tripMap.put("tripName", trips.getTripName());
            tripMap.put("startDate", trips.getStartDate());
            tripMap.put("endDate", trips.getEndDate());
            tripMap.put("budget", trips.getBudget());
            tripMap.put("tripStatus", trips.getTripStatus());
            if(trips.getItinerary() != null) {
                List<String> itineraryIds = trips.getItinerary().stream().map(ObjectId::toHexString).collect(Collectors.toList());
                tripMap.put("itinerary", itineraryIds);
            } else {
                tripMap.put("itinerary", null);
            }

            if(trips.getGroupTripId() != null) {
                tripMap.put("groupTripId", trips.getGroupTripId().toHexString());
            } else {
                tripMap.put("groupTripId", null);
            }

            return tripMap;
        }).toList();

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
