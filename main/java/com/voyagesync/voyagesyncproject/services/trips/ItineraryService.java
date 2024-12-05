package com.voyagesync.voyagesyncproject.services.trips;

import com.voyagesync.voyagesyncproject.models.trips.Itinerary;
import com.voyagesync.voyagesyncproject.repositories.trips.ItineraryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ItineraryService {
    private final ItineraryRepository itineraryRepository;
    public ItineraryService(final ItineraryRepository itineraryRepository) {
        this.itineraryRepository = itineraryRepository;
    }

    public List<Itinerary> getAllItineraries(){
        return itineraryRepository.findAll();
    }

}
