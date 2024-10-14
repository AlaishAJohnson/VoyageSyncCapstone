package com.example.voyagesynccapstone.controllers;

import com.example.voyagesynccapstone.model.trips.Trips;
import com.example.voyagesynccapstone.services.TripService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/trips")
public class TripController {
    @Autowired
    private TripService tripService;

    @GetMapping("/{tripID}")
    public ResponseEntity<Trips> getTripById(@PathVariable ObjectId tripID) {
        Trips trip = tripService.getTripById(tripID);
        return ResponseEntity.ok(trip);
    }

    @PostMapping("/create")
    public ResponseEntity<String> createTrip(@RequestBody Trips trip) {
        tripService.createTrip(trip);
        return ResponseEntity.ok("Trip created successfully.");
    }
}
