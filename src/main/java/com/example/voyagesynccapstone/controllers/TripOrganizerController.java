package com.example.voyagesynccapstone.controllers;
@RestController
@RequestMapping("/trip-organizer")
public class TripOrganizerController {
    private TripOrganizerService tripOrganizerService;

    @GetMapping("/{organizerID}")
    public ResponseEntity<TripOrganizer> getOrganizerById(@PathVariable Long organizerID) {
        TripOrganizer organizer = tripOrganizerService.getOrganizerById(organizerID);
        return ResponseEntity.ok(organizer);
    }

    @PostMapping("/assign-permission")
    public ResponseEntity<String> assignPermissionToOrganizer(
            @RequestParam Long organizerID, @RequestParam Long permissionID) {
        tripOrganizerService.assignPermission(organizerID, permissionID);
        return ResponseEntity.ok("Permission assigned successfully.");
    }
}
