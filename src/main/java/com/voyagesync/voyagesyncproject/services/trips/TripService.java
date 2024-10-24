package com.voyagesync.voyagesyncproject.services.trips;

import com.voyagesync.voyagesyncproject.models.trips.GroupTrips;
import com.voyagesync.voyagesyncproject.models.trips.Trips;
import com.voyagesync.voyagesyncproject.repositories.trips.GroupTripRepository;
import com.voyagesync.voyagesyncproject.repositories.trips.TripRepository;
import com.voyagesync.voyagesyncproject.repositories.users.UsersRepository;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class TripService {
    private final TripRepository tripRepository;
    private final GroupTripRepository groupTripRepository;
    private final UsersRepository usersRepository;
    public TripService(final TripRepository tripRepository, final GroupTripRepository groupTripRepository, final UsersRepository usersRepository) {
        this.tripRepository = tripRepository;
        this.groupTripRepository = groupTripRepository;
        this.usersRepository = usersRepository;
    }

    public List<Trips> getAllTrips(){
        return tripRepository.findAll();
    }

    /* POST METHODS */
    public Trips createTrip(final Trips trip, boolean isGroupTrip, ObjectId userId) {

        if(!usersRepository.existsById(userId)) {
            throw new IllegalArgumentException("User does not exist");
        }

        trip.setOrganizerId(userId);
        trip.setIsGroupTrip(isGroupTrip);
        if (isGroupTrip) {
            GroupTrips groupTrip = new GroupTrips();
            groupTrip.setMembers(new ArrayList<>());
            groupTrip.setCreatedAt(LocalDateTime.now());

            GroupTrips savedGroupTrip = groupTripRepository.save(groupTrip);
            trip.setGroupTripId(savedGroupTrip.getGroupTripId());

            List<ObjectId> members = new ArrayList<>();
            members.add(userId);
            groupTrip.setMembers(members);

            groupTripRepository.save(groupTrip);
        }
        return tripRepository.save(trip);
    }

}
