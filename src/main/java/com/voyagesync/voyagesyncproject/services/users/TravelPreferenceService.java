package com.voyagesync.voyagesyncproject.services.users;

import com.voyagesync.voyagesyncproject.models.users.TravelPreferences;
import com.voyagesync.voyagesyncproject.repositories.users.TravelPreferenceRepository;
import org.springframework.stereotype.Service;

@Service
public class TravelPreferenceService {
    private final TravelPreferenceRepository travelPreferenceRepository;
    public TravelPreferenceService(final TravelPreferenceRepository travelPreferenceRepository) {
        this.travelPreferenceRepository = travelPreferenceRepository;
    }

    public TravelPreferences savePreferences(final TravelPreferences preferences) {
        return travelPreferenceRepository.save(preferences);
    }
}
