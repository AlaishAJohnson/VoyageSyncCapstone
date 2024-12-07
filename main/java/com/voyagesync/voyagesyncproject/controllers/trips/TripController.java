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
@CrossOrigin(origins = "http://localhost:8081")
public class TripController {
    private final TripService tripService;



    public TripController(final TripService tripService) {
        this.tripService = tripService;

    }

    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> getAllTrips() {
        List<Trips> tripsList = tripService.getAllTrips();
        Map<String, Object> response = mapTripToResponse(tripsList);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/{tripId}")
    public ResponseEntity<Map<String, Object>> getTripById(@PathVariable("tripId") String tripId) {
        final Trips trip = tripService.getTripById(tripId);

        if (trip == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        final Map<String, Object> tripMap = new LinkedHashMap<>();

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
            tripMap.put("itinerary", trip.getItinerary());
        }
        if (trip.getMemberIds() != null) {
            tripMap.put("memberIds", trip.getMemberIds());
        }

        return new ResponseEntity<>(tripMap, HttpStatus.OK);
    }




    @GetMapping("/organizer/{organizerId}")
    public ResponseEntity<Map<String, Object>> getTripsByOrganizer(@PathVariable String organizerId) {
        List<Trips> trips = tripService.getTripsByOrganizerId(organizerId);
        Map<String, Object> response = mapTripToResponse(trips);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/organizer-member/{organizerId}")
    public ResponseEntity<Map<String, Object>> getTripsByOrganizerOrMemberId(@PathVariable String organizerId) {
        List<Trips> trips = tripService.getAllTripsByUserId(organizerId);
        Map<String, Object> response = mapTripToResponse(trips);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/member/{userId}")
    public ResponseEntity<Map<String, Object>> getTripsByMemberId(@PathVariable String userId) {
        List<Trips> trips = tripService.getAllTripsByMemberId(userId);
        ObjectId userObjectId = new ObjectId(userId);
        List<Trips> filteredTrips = trips.stream()
                .filter(trip -> !trip.getOrganizerId().equals(userObjectId))
                .collect(Collectors.toList());
        Map<String, Object> response = mapTripToResponse(filteredTrips);
        return ResponseEntity.ok(response);
    }


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

    private Map<String, Object> mapTripToResponse(List<Trips> trips) {
        List<Map<String, Object>> tripsList = new ArrayList<>();

        for (Trips trip : trips) {
            Map<String, Object> tripMap = new LinkedHashMap<>();
            tripMap.put("tripId", trip.getTripId().toHexString());
            tripMap.put("organizerId", trip.getOrganizerId().toHexString());
            tripMap.put("tripName", trip.getTripName());
            tripMap.put("imageUrl", trip.getImageUrl());
            tripMap.put("destination", trip.getDestination());
            tripMap.put("startDate", trip.getStartDate());
            tripMap.put("endDate", trip.getEndDate());
            tripMap.put("budget", trip.getBudget());
            tripMap.put("tripStatus", trip.getTripStatus());
            tripMap.put("isGroupTrip", trip.isGroupTrip());

            if (trip.getItinerary() != null) {
                List<String> itineraryDates = trip.getItinerary().stream()
                        .map(ObjectId::toString) // assuming itinerary is a date or timestamp
                        .collect(Collectors.toList());
                tripMap.put("itinerary", itineraryDates);
            } else {
                tripMap.put("itinerary", null);
            }

            if (trip.getMemberIds() != null) {
                List<String> memberIds = trip.getMemberIds().stream()
                        .map(ObjectId::toHexString) // assuming memberIds are ObjectIds
                        .collect(Collectors.toList());
                tripMap.put("memberIds", memberIds);
            } else {
                tripMap.put("memberIds", null);
            }

            tripsList.add(tripMap);
        }

        Map<String, Object> responseMap = new LinkedHashMap<>();
        responseMap.put("trips", tripsList);
        return responseMap;
    }

}
