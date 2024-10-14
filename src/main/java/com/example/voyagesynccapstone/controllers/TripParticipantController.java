package com.example.voyagesynccapstone.controllers;
@RestController
@RequestMapping("/trip-participant")
public class TripParticipantController {
    @Autowired
    private TripParticipantService tripParticipantService;

    @GetMapping("/{participantID}")
    public ResponseEntity<TripParticipant> getParticipantById(@PathVariable Long participantID) {
        TripParticipant participant = tripParticipantService.getParticipantById(participantID);
        return ResponseEntity.ok(participant);
    }

    @PostMapping("/assign-permission")
    public ResponseEntity<String> assignPermissionToParticipant(
            @RequestParam Long participantID, @RequestParam Long permissionID) {
        tripParticipantService.assignPermission(participantID, permissionID);
        return ResponseEntity.ok("Permission assigned successfully.");
    }
}
