package com.voyagesync.voyagesyncproject.controllers.trips;

import com.voyagesync.voyagesyncproject.models.trips.Itinerary;
import com.voyagesync.voyagesyncproject.services.trips.ItineraryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
