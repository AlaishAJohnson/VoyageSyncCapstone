package com.voyagesync.voyagesyncproject.controllers.trips;

import com.voyagesync.voyagesyncproject.models.trips.GroupTrips;
import com.voyagesync.voyagesyncproject.models.trips.Trips;
import com.voyagesync.voyagesyncproject.repositories.trips.GroupTripRepository;
import com.voyagesync.voyagesyncproject.services.trips.TripService;
import org.bson.types.ObjectId;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/trips")
public class TripController {
    private final TripService tripService;
    private final GroupTripRepository groupTripRepository;

    public TripController(final TripService tripService, GroupTripRepository groupTripRepository) {
        this.tripService = tripService;
        this.groupTripRepository = groupTripRepository;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllTrips() {
        List<Trips> tripsList = tripService.getAllTrips();
        List<Map<String, Object>> response = tripsList.stream().map(trips -> {

            Map<String, Object> tripMap = new LinkedHashMap<>();
            tripMap.put("tripId", trips.getTripId().toHexString());
            tripMap.put("organizerId", trips.getOrganizerId().toHexString());
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

//    @GetMapping("/trips/user/{userId}")
//    public ResponseEntity<List<Trips>> getAllUserTrips(@PathVariable String userId) {
//        List<Trips> trips = tripService.getAllUserTrips(userId);
//        return ResponseEntity.ok(trips);
//    }

    @GetMapping("/organizer/{organizerId}")
    public ResponseEntity<List<Trips>> getTripsByOrganizer(@PathVariable ObjectId organizerId) {
        List<Trips> trips = tripService.getTripsByOrganizerId(organizerId);
        return ResponseEntity.ok(trips);
    }



    // check this
    @PostMapping("/create")
    public ResponseEntity<Trips> createTrip(@RequestBody Map<String, Object> tripDetails, @RequestParam boolean isGroupTrip, @RequestParam ObjectId userId){
        Trips newTrip = new Trips();

        newTrip.setTripName((String) tripDetails.get("tripName"));
        newTrip.setDestination((String) tripDetails.get("destination"));
        newTrip.setStartDate(LocalDate.parse((String) tripDetails.get("startDate")));
        newTrip.setEndDate(LocalDate.parse((String) tripDetails.get("endDate")));
        newTrip.setBudget((double) tripDetails.get("budget"));

        newTrip.setOrganizerId(userId);
        if(isGroupTrip){
            GroupTrips groupTrip = new GroupTrips();
            groupTrip.setMembers(new ArrayList<>());
            groupTrip.setCreatedAt(LocalDateTime.now());

            GroupTrips savedGroupTrip = groupTripRepository.save(groupTrip);
            newTrip.setGroupTripId(savedGroupTrip.getGroupTripId());
            newTrip.setIsGroupTrip(true);
        } else {
            newTrip.setIsGroupTrip(false);
        }

        Trips createdTrip = tripService.createTrip(newTrip, isGroupTrip, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTrip);
    }
}
