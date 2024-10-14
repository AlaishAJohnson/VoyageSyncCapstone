package com.example.voyagesynccapstone.services;

import com.example.voyagesynccapstone.interfaces.trips.TripRepository;
import com.example.voyagesynccapstone.model.trips.Trips;
import com.example.voyagesynccapstone.services.exceptions.ResourceNotFoundException;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TripService {
    @Autowired
    private TripRepository tripRepository;

    public List<Trips> getAllTrips() {
        return tripRepository.findAll();
    }

    public Trips getTripById(ObjectId tripID) {
        return tripRepository.findById(tripID)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id " + tripID));
    }

    public Trips createTrip(Trips trip) {
        return tripRepository.save(trip);
    }

    public void deleteTrip(ObjectId tripID) {
        tripRepository.deleteById(tripID);
    }
}
