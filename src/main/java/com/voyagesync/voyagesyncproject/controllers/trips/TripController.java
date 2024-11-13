package com.voyagesync.voyagesyncproject.controllers.trips;


import com.voyagesync.voyagesyncproject.models.trips.Trips;
import com.voyagesync.voyagesyncproject.services.trips.TripService;
import org.bson.types.ObjectId;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
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

    @GetMapping("/")
    public ResponseEntity<List<Map<String, Object>>> getAllTrips() {
        List<Trips> tripsList = tripService.getAllTrips();
        List<Map<String, Object>> response = tripsList.stream().map(trip -> {
            Map<String, Object> tripMap = new LinkedHashMap<>();
            tripMap.put("tripId", trip.getTripId().toHexString());
            tripMap.put("organizerId", trip.getOrganizerId().toHexString());
            tripMap.put("tripName", trip.getTripName());
            tripMap.put("destination", trip.getDestination());
            tripMap.put("startDate", trip.getStartDate());
            tripMap.put("endDate", trip.getEndDate());
            tripMap.put("budget", trip.getBudget());
            tripMap.put("tripStatus", trip.getTripStatus());
            tripMap.put("isGroupTrip", trip.isGroupTrip());
            tripMap.put("imageUrl", trip.getImageUrl());

            if (trip.getItinerary() != null) {
                List<String> itineraryIds = trip.getItinerary().stream()
                        .map(ObjectId::toHexString)
                        .collect(Collectors.toList());
                tripMap.put("itinerary", itineraryIds);
            } else {
                tripMap.put("itinerary", null);
            }

            if (trip.getMemberIds() != null) {
                List<String> memberIds = trip.getMemberIds().stream()
                        .map(ObjectId::toHexString)
                        .collect(Collectors.toList());
                tripMap.put("memberIds", memberIds);
            } else {
                tripMap.put("memberIds", null);
            }

            return tripMap;
        }).toList();

        return new ResponseEntity<>(response, HttpStatus.OK);
    }




    @GetMapping("/organizer/{organizerId}")
    public ResponseEntity<List<Trips>> getTripsByOrganizer(@PathVariable String organizerId) {
        List<Trips> trips = tripService.getTripsByOrganizerId(organizerId);
        return ResponseEntity.ok(trips);
    }


    @GetMapping("/organizer-member/{organizerId}")
    public ResponseEntity<List<Trips>> getTripsByOrganizerOrMemberId(@PathVariable String organizerId) {
        List<Trips> trips = tripService.getAllTripsByUserId(organizerId);
        return ResponseEntity.ok(trips);
    }
    @GetMapping("/member/{userId}")
    public ResponseEntity<List<Trips>> getTripsByMemberId(@PathVariable String userId) {
        List<Trips> trips = tripService.getAllTripsByMemberId(userId);
        ObjectId userObjectId = new ObjectId(userId);
        List<Trips> filteredTrips = trips.stream()
                .filter(trip -> !trip.getOrganizerId().equals(userObjectId))
                .collect(Collectors.toList());
        return ResponseEntity.ok(filteredTrips);
    }

    // check this
    @PostMapping("/create-trip")
    public ResponseEntity<Object> createTrip(@RequestBody Map<String, Object> tripDetails, @RequestParam boolean isGroupTrip, @RequestParam String organizerId) {
        Trips newTrip = new Trips();
        newTrip.setTripName(tripDetails.get("tripName").toString());
        newTrip.setDestination(tripDetails.get("destination").toString());
        newTrip.setStartDate(LocalDate.parse(tripDetails.get("startDate").toString()));
        newTrip.setEndDate(LocalDate.parse(tripDetails.get("endDate").toString()));
        newTrip.setBudget((double) tripDetails.get("budget"));

        ObjectId organizerObjectId = new ObjectId(organizerId);
        newTrip.setOrganizerId(organizerObjectId);
        if(isGroupTrip) {
            List<ObjectId> memberIds = new ArrayList<>();
            memberIds.add(organizerObjectId);
            newTrip.setMemberIds(memberIds);
        } else {
            newTrip.setMemberIds(null);
        }

        newTrip.setItinerary(new ArrayList<>());
        Trips createdTrip = tripService.saveTrip(newTrip);
        return new ResponseEntity<>(createdTrip, HttpStatus.CREATED);

    }
}
