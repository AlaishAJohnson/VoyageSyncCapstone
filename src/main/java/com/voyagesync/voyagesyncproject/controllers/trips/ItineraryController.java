package com.voyagesync.voyagesyncproject.controllers.trips;

import com.voyagesync.voyagesyncproject.enums.ConfirmationStatus;
import com.voyagesync.voyagesyncproject.models.bookings.Services;
import com.voyagesync.voyagesyncproject.models.trips.Itinerary;
import com.voyagesync.voyagesyncproject.repositories.bookings.ServiceRepository;
import com.voyagesync.voyagesyncproject.repositories.trips.ItineraryRepository;
import com.voyagesync.voyagesyncproject.services.trips.ItineraryService;
import com.voyagesync.voyagesyncproject.services.trips.VoteService;
import org.bson.types.ObjectId;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/itinerary")
@CrossOrigin(origins = "http://localhost:8081")
public class ItineraryController {
    private final ItineraryService itineraryService;
    private final VoteService voteService;
    private final ItineraryRepository itineraryRepository;
    private final ServiceRepository serviceRepository;
    public ItineraryController(final ItineraryService itineraryService, VoteService voteService, ItineraryRepository itineraryRepository, ServiceRepository serviceRepository) {
        this.itineraryService = itineraryService;
        this.voteService = voteService;
        this.itineraryRepository = itineraryRepository;
        this.serviceRepository = serviceRepository;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllItineraries() {
        List<Itinerary> itineraryList = itineraryService.getAllItineraries();
        List<Map<String, Object>> response = itineraryList.stream().map(itinerary -> {

            Map<String, Object> itineraryMap = new LinkedHashMap<>();
            itineraryMap.put("itineraryId", itinerary.getItineraryId().toHexString());
            itineraryMap.put("serviceId", itinerary.getServiceId());
            itineraryMap.put("dateOfService", itinerary.getDateOfService());
            itineraryMap.put("timeOfService", itinerary.getTimeOfService());
            itineraryMap.put("confirmationStatus", itinerary.getConfirmationStatus());
            itineraryMap.put("voteCount", itinerary.getVoteCount());

            if(itinerary.getBookingId() != null) {
                itineraryMap.put("bookingId", itinerary.getBookingId().toHexString());
            } else {
                itineraryMap.put("bookingId", null);
            }


            return itineraryMap;
        }).toList();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/{tripId}/itineraries")
    public ResponseEntity<List<Map<String, Object>>> getItinerariesWithVoteStatus(
            @PathVariable ObjectId tripId,
            @RequestParam ObjectId userId) {
        try {
            List<Map<String, Object>> itineraries = itineraryService.getItinerariesWithVoteStatus(tripId, userId);
            return ResponseEntity.ok(itineraries);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    @GetMapping("/{tripId}/{creatorId}")
    public ResponseEntity<List<Map<String, Object>>> getItineraryItems(@PathVariable String tripId, @PathVariable String creatorId) {
        List<Map<String, Object>> itineraryItems = itineraryService.getItineraryItemsByTripAndCreator(tripId, creatorId);
        return ResponseEntity.ok(itineraryItems);
    }

    @GetMapping("/trip-itinerary/{tripId}")
    public ResponseEntity<List<Map<String,Object>>> getItineraryItemsByTrip(@PathVariable String tripId){
        List<Map<String, Object>> itineraryItems = itineraryService.getItineraryByTripId(tripId);
        return ResponseEntity.ok(itineraryItems);
    }
    @PostMapping("/create/{tripId}")
    public ResponseEntity<?> createItinerary(@PathVariable("tripId") String tripId, @RequestBody Itinerary itinerary) {
        try {
            Itinerary newItinerary = new Itinerary();

            ObjectId serviceId = new ObjectId(itinerary.getServiceId().toHexString());
            ObjectId creatorId = new ObjectId(itinerary.getCreatorId().toHexString());
            ObjectId tripObjId = new ObjectId(tripId);
            System.out.println("Booking Date: " + itinerary.getDateOfService());

            newItinerary.setServiceId(serviceId);
            newItinerary.setDateOfService(itinerary.getDateOfService());
            newItinerary.setCreatorId(creatorId);
            newItinerary.setTripId(tripObjId);
            newItinerary.setConfirmationStatus(ConfirmationStatus.CONFIRMED);
            newItinerary.setVoteCount(itinerary.getVoteCount());
            newItinerary.setTimeOfService(itinerary.getTimeOfService());


            Itinerary savedItinerary = itineraryRepository.save(newItinerary);

            Map<String, Object> response = new LinkedHashMap<>();
            response.put("itineraryId", savedItinerary.getItineraryId().toHexString());
            response.put("serviceId", savedItinerary.getServiceId().toHexString());
            response.put("dateOfService", savedItinerary.getDateOfService());
            response.put("timeOfService", savedItinerary.getTimeOfService());
            response.put("confirmationStatus", savedItinerary.getConfirmationStatus());
            response.put("voteCount", savedItinerary.getVoteCount());
            response.put("creatorId", savedItinerary.getCreatorId().toHexString());
            response.put("tripId", savedItinerary.getTripId().toHexString());
            if (savedItinerary.getVotes() != null) {
                response.put("Votes", savedItinerary.getVotes());
            }
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (Exception e) {
            Map<String, String> errorResponse = new LinkedHashMap<>();
            errorResponse.put("error", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }


    @GetMapping("/{itineraryId}")
    public ResponseEntity<Map<String, Object>> getItineraryById(@PathVariable("itineraryId") final String itineraryId) {
        try {
            ObjectId id = new ObjectId(itineraryId);
            Itinerary itineraryItem = itineraryService.getItineraryById(id);

            if (itineraryItem == null) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

            Map<String, Object> response = new LinkedHashMap<>();
            response.put("itineraryId", itineraryItem.getItineraryId().toHexString());
            response.put("serviceId", itineraryItem.getServiceId() != null ? itineraryItem.getServiceId().toHexString() : null);
            response.put("dateOfService", itineraryItem.getDateOfService());
            response.put("timeOfService", itineraryItem.getTimeOfService());
            response.put("confirmationStatus", itineraryItem.getConfirmationStatus());
            response.put("voteCount", itineraryItem.getVoteCount());
            response.put("creatorId", itineraryItem.getCreatorId().toHexString());

            if (itineraryItem.getVotes() != null) {
                response.put("Votes", itineraryItem.getVotes());
            }

            if (itineraryItem.getServiceId() != null) {
                Optional<Services> optionalService = serviceRepository.findById(itineraryItem.getServiceId());
                optionalService.ifPresent(service -> {
                    response.put("serviceName", service.getServiceName());
                    response.put("location", service.getLocation());
                    response.put("price", service.getPrice());
                    response.put("vendorId", service.getVendorId().toHexString());
                });
            } else {
                // Adding null values for service information when serviceId is absent
                response.put("serviceName", null);
                response.put("location", null);
                response.put("price", null);
                response.put("vendorId", null);
            }

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            System.err.println("Invalid itinerary ID: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            System.err.println("Error fetching itinerary: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/{itineraryId}/vote")
    public ResponseEntity<?> voteOnItinerary(@PathVariable String itineraryId,
                                             @RequestParam String userId,
                                             @RequestParam boolean vote) {
        try {
            boolean voteUpdated = itineraryService.updateVoteCount(itineraryId, userId, vote);

            if (voteUpdated) {
                return ResponseEntity.ok(("Vote recorded successfully"));
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(("Failed to record vote"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(("Error voting on itinerary"));
        }
    }



    @GetMapping("/{itineraryId}/yesVotes")
    public ResponseEntity<Integer> getYesVoteCount(@PathVariable String itineraryId) {
        int yesVotes = itineraryService.getYesVoteCount(itineraryId);
        return ResponseEntity.ok(yesVotes);
    }

    @GetMapping("/{itineraryId}/majority")
    public ResponseEntity<Boolean> checkMajorityVotes(@PathVariable String itineraryId) {
        boolean majority = itineraryService.checkMajorityVotes(itineraryId);
        return ResponseEntity.ok(majority);
    }

    @PostMapping("/{itineraryId}/addToTrip")
    public ResponseEntity<Void> addToItinerary(@PathVariable String itineraryId) {
        itineraryService.addToItinerary(itineraryId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{itineraryId}")
    public ResponseEntity<Void> deleteItineraryItem(@PathVariable String itineraryId) {
        itineraryService.deleteItineraryItem(itineraryId);
        return ResponseEntity.noContent().build();
    }
    @PostMapping("/{itineraryId}/checkAndBook")
    public ResponseEntity<Void> checkAndBookItinerary(@PathVariable String itineraryId, @RequestParam ObjectId tripId) {
        try {
            itineraryService.checkAndBookItinerary(itineraryId, tripId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    @PostMapping("/add-to-vote")
    public ResponseEntity<String> addVote(@RequestParam String itineraryId, @RequestParam String userId, @RequestParam boolean vote) {
        boolean success = itineraryService.addToVote(itineraryId, userId, vote);
        if (success) {
            return ResponseEntity.ok("Vote added successfully");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User has already voted on this itinerary");
        }
    }


}
