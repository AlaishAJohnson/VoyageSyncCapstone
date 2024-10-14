package com.example.voyagesynccapstone.controllers;

import com.example.voyagesynccapstone.model.permissions.TripOrganizerPermissions;
import com.example.voyagesynccapstone.services.TripOrganizerService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/trip-organizers")
public class TripOrganizerController {

    @Autowired
    private TripOrganizerService tripOrganizerService;

    @GetMapping("/{userID}")
    public ResponseEntity<TripOrganizerPermissions> getPermissionsByUserId(@PathVariable ObjectId userID) {
        TripOrganizerPermissions permissions = tripOrganizerService.getPermissionsByUserId(userID);
        return ResponseEntity.ok(permissions);
    }

    @PostMapping("/assign-permission")
    public ResponseEntity<String> assignPermissions(
            @RequestParam ObjectId userID,
            @RequestParam boolean canEditTrip,
            @RequestParam boolean canDeleteTrip,
            @RequestParam boolean canInviteParticipants,
            @RequestParam boolean canManageItinerary,
            @RequestParam boolean canSuggestItinerary,
            @RequestParam boolean canCommunicateWithParticipants,
            @RequestParam boolean canTransferRole) {

        tripOrganizerService.assignPermissions(userID, canEditTrip, canDeleteTrip, canInviteParticipants, canManageItinerary, canSuggestItinerary, canCommunicateWithParticipants, canTransferRole);
        return ResponseEntity.ok("Permissions assigned successfully.");
    }

    @GetMapping("/all")
    public ResponseEntity<List<TripOrganizerPermissions>> getAllPermissions() {
        List<TripOrganizerPermissions> allPermissions = tripOrganizerService.getAllPermissions();
        return ResponseEntity.ok(allPermissions);
    }

    @GetMapping("/manage-itinerary/{canManage}")
    public ResponseEntity<List<TripOrganizerPermissions>> getByManageItinerary(@PathVariable boolean canManage) {
        List<TripOrganizerPermissions> permissions = tripOrganizerService.getByManageItinerary(canManage);
        return ResponseEntity.ok(permissions);
    }

    @GetMapping("/suggest-itinerary/{canSuggest}")
    public ResponseEntity<List<TripOrganizerPermissions>> getBySuggestItinerary(@PathVariable boolean canSuggest) {
        List<TripOrganizerPermissions> permissions = tripOrganizerService.getBySuggestItinerary(canSuggest);
        return ResponseEntity.ok(permissions);
    }

    @GetMapping("/communicate-participants/{canCommunicate}")
    public ResponseEntity<List<TripOrganizerPermissions>> getByCommunicateWithParticipants(@PathVariable boolean canCommunicate) {
        List<TripOrganizerPermissions> permissions = tripOrganizerService.getByCommunicateWithParticipants(canCommunicate);
        return ResponseEntity.ok(permissions);
    }

    @GetMapping("/transfer-role/{canTransfer}")
    public ResponseEntity<List<TripOrganizerPermissions>> getByTransferRole(@PathVariable boolean canTransfer) {
        List<TripOrganizerPermissions> permissions = tripOrganizerService.getByTransferRole(canTransfer);
        return ResponseEntity.ok(permissions);
    }
}
