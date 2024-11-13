package com.voyagesync.voyagesyncproject.services.users;

import com.voyagesync.voyagesyncproject.models.users.TravelPreferences;
import com.voyagesync.voyagesyncproject.repositories.users.TravelPreferenceRepository;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class TravelPreferenceService {
    private final TravelPreferenceRepository travelPreferenceRepository;
    public TravelPreferenceService(final TravelPreferenceRepository travelPreferenceRepository) {
        this.travelPreferenceRepository = travelPreferenceRepository;
    }

    public TravelPreferences savePreferences(TravelPreferences preferences) {
        return travelPreferenceRepository.save(preferences);
    }

    public Optional<TravelPreferences> findById(String id) {
        try {
            ObjectId objectId = new ObjectId(id);
            return travelPreferenceRepository.findById(objectId);
        } catch (IllegalArgumentException e) {
            return Optional.empty();
        }
    }

    public TravelPreferences updateOrCreateTravelPreference(String preferencesId, TravelPreferences newPreferences) {
        ObjectId objectId = new ObjectId(preferencesId);
        TravelPreferences preferencesList = travelPreferenceRepository.findById(objectId).orElse(null);
        if (preferencesList == null) {
            preferencesList = new TravelPreferences();
        }

        preferencesList.setActivities(newPreferences.getActivities());
        preferencesList.setFood(newPreferences.getFood());
        preferencesList.setWeather(newPreferences.getWeather());

        return travelPreferenceRepository.save(preferencesList);
    }

    public TravelPreferences updatePreferences(String id, TravelPreferences updatedPreferences) {
        ObjectId objectId = new ObjectId(id);
        updatedPreferences.setPreferenceId(objectId);
        return travelPreferenceRepository.save(updatedPreferences);
    }


    public TravelPreferences createTravelPreference(TravelPreferences newPreference) {
        try {

            return travelPreferenceRepository.save(newPreference);
        } catch (Exception e) {
            throw new RuntimeException("Error creating travel preference: " + e.getMessage());
        }
    }
}
