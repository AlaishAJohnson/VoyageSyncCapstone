package com.voyagesync.voyagesyncproject.services.trips;

import com.voyagesync.voyagesyncproject.models.trips.GroupTrips;
import com.voyagesync.voyagesyncproject.repositories.trips.GroupTripRepository;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GroupTripServices {

    private final GroupTripRepository groupTripRepository;

    public GroupTripServices(final GroupTripRepository groupTripRepository) {
        this.groupTripRepository = groupTripRepository;
    }

    public List<GroupTrips> getAllGroupTrips(){
        return groupTripRepository.findAll();
    }
//    public List<GroupTrips> getAllGroupTripsWithOrganizerId(String organizerId) {
//        return groupTripRepository.getAllGroupTripsWithOrganizerId(new ObjectId(organizerId));
//    }
//
//    public List<GroupTrips> getAllGroupTripsContainingMemberId(String memberId) {
//        return groupTripRepository.getAllGroupTripsContainingMemberId(new ObjectId(memberId));
//    }
//

}
