package com.voyagesync.voyagesyncproject.services.trips;

import com.voyagesync.voyagesyncproject.models.trips.Trips;
import com.voyagesync.voyagesyncproject.repositories.trips.TripRespository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TripService {
    private final TripRespository tripRepository;
    public TripService(final TripRespository tripRepository) {
        this.tripRepository = tripRepository;
    }

    public List<Trips> getAllTrips(){
        return tripRepository.findAll();
    }
}
