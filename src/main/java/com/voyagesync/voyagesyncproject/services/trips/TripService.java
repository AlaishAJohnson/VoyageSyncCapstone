package com.voyagesync.voyagesyncproject.services.trips;

import com.voyagesync.voyagesyncproject.models.trips.Trips;
import com.voyagesync.voyagesyncproject.repositories.trips.TripRepository;
import com.voyagesync.voyagesyncproject.repositories.users.UsersRepository;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TripService {
    private final TripRepository tripRepository;
    private final UsersRepository usersRepository;
    public TripService(final TripRepository tripRepository, final UsersRepository usersRepository) {
        this.tripRepository = tripRepository;
        this.usersRepository = usersRepository;
    }

    public List<Trips> getAllTrips(){
        return tripRepository.findAll();
    }

    public Trips getTripById(final String tripId) {
        ObjectId tripObjectId = new ObjectId(tripId);
        return tripRepository.findById(tripObjectId).orElse(null);
    }

    public List<Trips> getTripsByOrganizerId(String organizerId) {
        ObjectId organizerObjectId = new ObjectId(organizerId);
        return tripRepository.findByOrganizerId(organizerObjectId);
    }

    public List<Trips> getAllTripsByUserId(String userId) {
        ObjectId userObjectId = new ObjectId(userId);
        return tripRepository.findByOrganizerIdOrMemberIdsContaining(userObjectId, userObjectId);

    }

    public List<Trips> getAllTripsByMemberId(String memberId) {
        ObjectId memberObjectId = new ObjectId(memberId);
        return tripRepository.findByMemberIds(memberObjectId);
    }

    public Trips saveTrip(final Trips trip) {
        return tripRepository.save(trip);
    }



    /* POST METHODS */

    /* Helper Functions */


}
