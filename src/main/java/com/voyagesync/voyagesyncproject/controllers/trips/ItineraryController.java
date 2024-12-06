package com.voyagesync.voyagesyncproject.controllers.trips;

import com.voyagesync.voyagesyncproject.models.trips.Itinerary;
import com.voyagesync.voyagesyncproject.services.trips.ItineraryService;
import org.bson.types.ObjectId;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/itinerary")
@CrossOrigin(origins = "http://localhost:8081")
public class ItineraryController {
    private final ItineraryService itineraryService;
    public ItineraryController(final ItineraryService itineraryService) {
        this.itineraryService = itineraryService;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllItineraries() {
        List<Itinerary> itineraryList = itineraryService.getAllItineraries();
        List<Map<String, Object>> response = itineraryList.stream().map(itinerary -> {

            Map<String, Object> itineraryMap = new LinkedHashMap<>();
            itineraryMap.put("itineraryId", itinerary.getItineraryId().toHexString());
            itineraryMap.put("nameOfService", itinerary.getNameOfService());
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


    @GetMapping("/{itineraryId}")
    public ResponseEntity<Map<String, Object>> getItineraryById(@PathVariable("itineraryId") final String itineraryId) {
        try {
            ObjectId id = new ObjectId(itineraryId);
            Itinerary itineraryItem = itineraryService.getItineraryById(id);

            if (itineraryItem == null) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

            // Map itineraryItem to a response object
            Map<String, Object> response = new LinkedHashMap<>();
            response.put("itineraryId", itineraryItem.getItineraryId().toHexString());
            response.put("nameOfService", itineraryItem.getNameOfService());
            response.put("dateOfService", itineraryItem.getDateOfService());
            response.put("timeOfService", itineraryItem.getTimeOfService());
            response.put("confirmationStatus", itineraryItem.getConfirmationStatus());
            response.put("voteCount", itineraryItem.getVoteCount());

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            System.err.println("Invalid itinerary ID: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            System.err.println("Error fetching itinerary: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
