package com.voyagesync.voyagesyncproject.controllers.trips;

import com.voyagesync.voyagesyncproject.models.trips.GroupTrips;
import com.voyagesync.voyagesyncproject.services.trips.GroupTripServices;
import org.bson.types.ObjectId;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/groupTrips")
public class GroupTripsController {

    private final GroupTripServices groupTripService;
    public GroupTripsController(final GroupTripServices groupTripService) {
        this.groupTripService = groupTripService;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllGroupTrips() {
       List<GroupTrips> groupTripsList = groupTripService.getAllGroupTrips();
       List<Map<String, Object>> response = groupTripsList.stream().map(groupTrips -> {
           Map<String, Object> groupTripMap = new LinkedHashMap<>();
           groupTripMap.put("groupTripId", groupTrips.getGroupTripId().toHexString());
           groupTripMap.put("majorityVoteRule", groupTrips.getMajorityVoteRule());
           groupTripMap.put("votingStatus", groupTrips.isVotingStatus());
           List<String> membersIds = groupTrips.getMembers().stream().map(ObjectId::toHexString).collect(Collectors.toList());
           groupTripMap.put("members", membersIds);
           return groupTripMap;
       }).toList();
       return new ResponseEntity<>(response, HttpStatus.OK);
    }


}
