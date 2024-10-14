package com.example.voyagesynccapstone.controllers;
@RestController
@RequestMapping("/trips")
public class TripController {
    @Autowired
    private TripService tripService;

    @GetMapping("/{tripID}")
    public ResponseEntity<Trip> getTripById(@PathVariable Long tripID) {
        Trip trip = tripService.getTripById(tripID);
        return ResponseEntity.ok(trip);
    }

    @PostMapping("/create")
    public ResponseEntity<String> createTrip(@RequestParam String tripDetails) {
        tripService.createTrip(tripDetails);
        return ResponseEntity.ok("Trip created successfully.");
    }
}
