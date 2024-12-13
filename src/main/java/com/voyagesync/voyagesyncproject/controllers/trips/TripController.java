package com.voyagesync.voyagesyncproject.controllers.trips;


import com.voyagesync.voyagesyncproject.enums.ConfirmationStatus;
import com.voyagesync.voyagesyncproject.models.trips.Trips;
import com.voyagesync.voyagesyncproject.models.users.Users;
import com.voyagesync.voyagesyncproject.repositories.trips.ItineraryRepository;
import com.voyagesync.voyagesyncproject.repositories.trips.TripRepository;
import com.voyagesync.voyagesyncproject.services.trips.TripService;
import com.voyagesync.voyagesyncproject.models.trips.Itinerary;
import org.bson.types.ObjectId;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/trips")
@CrossOrigin(origins = "http://localhost:8081")
public class TripController {
    private final TripService tripService;
    private final ItineraryRepository itineraryRepository;
    private final TripRepository tripRepository;


    public TripController(final TripService tripService, ItineraryRepository itineraryRepository, TripRepository tripRepository) {
        this.tripService = tripService;
        this.itineraryRepository = itineraryRepository;
        this.tripRepository = tripRepository;

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

        List<Trips> tripsList = Collections.singletonList(trip);
        Map<String, Object> responseMap = mapTripToResponse(tripsList);

        return new ResponseEntity<>(responseMap, HttpStatus.OK);
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

    @PostMapping("/{tripId}/itinerary")
    public ResponseEntity<?> addItineraryItem(@PathVariable ObjectId tripId,
                                              @RequestBody Itinerary itinerary,
                                              @RequestParam ObjectId userId) {
        Optional<Trips> tripOpt = tripRepository.findById(tripId);

        if (tripOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Trip not found");
        }

        Trips trip = tripOpt.get();
        if (trip.getOrganizerId().equals(userId)) {
            itinerary.setConfirmationStatus(ConfirmationStatus.PENDING);
            itinerary.setCreatorId(userId);
            trip.getItinerary().add(itinerary.getItineraryId());
        } else if (trip.getMemberIds() != null && trip.getMemberIds().contains(userId)) {
            itinerary.setConfirmationStatus(ConfirmationStatus.PENDING);
            itinerary.setCreatorId(userId);
            trip.getItinerary().add(itinerary.getItineraryId());
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not authorized to add itinerary items.");
        }

        itineraryRepository.save(itinerary);
        tripRepository.save(trip);

        return ResponseEntity.status(HttpStatus.CREATED).body("Itinerary item added successfully.");
    }


    @PostMapping("/create-trip/{organizerId}")
    public ResponseEntity<Object> createTrip(
            @PathVariable String organizerId,
            @RequestBody Map<String, Object> tripDetails) {

        Trips newTrip = new Trips();

        System.out.println("Received trip details: " + tripDetails);

        Object tripNameObj = tripDetails.get("tripName");
        String tripName = null;
        if (tripNameObj instanceof String) {
            tripName = (String) tripNameObj;
        } else if (tripNameObj instanceof Map) {
            Map<String, Object> nestedTripName = (Map<String, Object>) tripNameObj;
            tripName = nestedTripName.get("tripName").toString();
        }
        newTrip.setTripName(tripName);

        Object destinationObj = tripDetails.get("destination");
        String destination = null;
        if (destinationObj instanceof String) {
            destination = (String) destinationObj;
        } else if (destinationObj instanceof Map) {
            Map<String, Object> nestedDestination = (Map<String, Object>) destinationObj;
            destination = nestedDestination.get("destination").toString();
        }
        newTrip.setDestination(destination);

        newTrip.setStartDate(LocalDate.parse(tripDetails.get("startDate").toString()));
        newTrip.setEndDate(LocalDate.parse(tripDetails.get("endDate").toString()));

        Object budgetObj = tripDetails.get("budget");
        Double budget = null;

        if (budgetObj instanceof Integer) {
            budget = ((Integer) budgetObj).doubleValue();
        } else if (budgetObj instanceof Double) {
            budget = (Double) budgetObj;
        } else if (budgetObj instanceof String) {
            try {
                budget = Double.valueOf((String) budgetObj);
            } catch (NumberFormatException e) {
                return new ResponseEntity<>("Invalid budget value", HttpStatus.BAD_REQUEST);
            }
        }

        if (budget != null) {
            newTrip.setBudget(budget);
        } else {
            return new ResponseEntity<>("Invalid budget value", HttpStatus.BAD_REQUEST);
        }

        if (tripDetails.containsKey("imageUrl")) {
            newTrip.setImageUrl(tripDetails.get("imageUrl").toString());
        } else {
            newTrip.setImageUrl(null);
        }
        ObjectId organizerObjectId = new ObjectId(organizerId);
        newTrip.setOrganizerId(organizerObjectId);

        if (tripDetails.containsKey("memberIds")) {
            List<ObjectId> memberIds = ((List<String>) tripDetails.get("memberIds"))
                    .stream()
                    .map(ObjectId::new)
                    .collect(Collectors.toList());
            if (!memberIds.contains(organizerObjectId)) {
                memberIds.add(organizerObjectId);
            }
            newTrip.setMemberIds(memberIds);
        } else {
            newTrip.setMemberIds(Collections.singletonList(organizerObjectId));
        }

        assert newTrip.getMemberIds() != null;
        newTrip.setGroupTrip(newTrip.getMemberIds().size() > 1);

        newTrip.setItinerary(new ArrayList<>());

        Trips createdTrip = tripService.saveTrip(newTrip);
        List<Trips> tripsList = Collections.singletonList(createdTrip);
        Map<String, Object> response = mapTripToResponse(tripsList);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/update-trip/{tripId}")
    public ResponseEntity<?> updateTrip(@PathVariable String tripId, @RequestBody Map<String, Object> tripDetails) {
        try {
            Trips tripToUpdate = new Trips();
            ObjectId tripObjectId = new ObjectId(tripId);
            tripToUpdate.setTripId(tripObjectId);

            if (tripDetails.containsKey("startDate")) {
                tripToUpdate.setStartDate(LocalDate.parse(tripDetails.get("startDate").toString()));
            }
            if (tripDetails.containsKey("tripName")) {
                tripToUpdate.setTripName(tripDetails.get("tripName").toString());
            }
            if (tripDetails.containsKey("destination")) {
                tripToUpdate.setDestination(tripDetails.get("destination").toString());
            }
            if (tripDetails.containsKey("imageUrl")) {
                tripToUpdate.setImageUrl(tripDetails.get("imageUrl").toString());
            }
            if (tripDetails.containsKey("endDate")) {
                tripToUpdate.setEndDate(LocalDate.parse(tripDetails.get("endDate").toString()));
            }
            if (tripDetails.containsKey("budget")) {
                tripToUpdate.setBudget(Double.parseDouble(tripDetails.get("budget").toString()));
            }

            Trips updatedTrip = tripService.getTripById(tripId);
            Map<String, Object> response = mapTripToResponse((List<Trips>) updatedTrip);
            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
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
