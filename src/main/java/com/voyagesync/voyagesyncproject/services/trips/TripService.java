package com.voyagesync.voyagesyncproject.services.trips;

import com.voyagesync.voyagesyncproject.models.trips.GroupTrips;
import com.voyagesync.voyagesyncproject.models.trips.Trips;
import com.voyagesync.voyagesyncproject.repositories.trips.GroupTripRepository;
import com.voyagesync.voyagesyncproject.repositories.trips.TripRepository;
import com.voyagesync.voyagesyncproject.repositories.users.UsersRepository;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
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

//    public List<Trips> getAllUserTrips(String userId) {
//
//        // Fetch individual trips where the user is the organizer
//        List<Trips> userTrips = new ArrayList<>(tripRepository.findByOrganizerId(new ObjectId(userId)));
//
//        // Fetch group trips where the user is a member
//        List<GroupTrips> memberTrips = groupTripRepository.getAllGroupTripsContainingMemberId(new ObjectId(userId));
//        for (GroupTrips groupTrip : memberTrips) {
//            // Convert GroupTrip to Trip
//            userTrips.add(convertGroupTripToTrip(groupTrip));
//        }
//
//        return userTrips;
//    }

    public List<Trips> getTripsByOrganizerId(ObjectId organizerId) {
        return tripRepository.findByOrganizerId(organizerId);
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

    /* Helper Functions */
    // Method to convert GroupTrip to Trip
    private Trips convertGroupTripToTrip(GroupTrips groupTrip) {
        Trips trip = new Trips();
        trip.setTripId(groupTrip.getGroupTripId()); // You may want to set this differently
        trip.setTripName("Group Trip"); // Example logic; adjust as needed
        trip.setDestination("Destination not specified"); // Example logic; adjust as needed
        trip.setStartDate(LocalDate.from(LocalDateTime.now())); // Set your start date logic
        trip.setEndDate(LocalDate.from(LocalDateTime.now().plusDays(7))); // Example logic; adjust as needed
        return trip;
    }
}
