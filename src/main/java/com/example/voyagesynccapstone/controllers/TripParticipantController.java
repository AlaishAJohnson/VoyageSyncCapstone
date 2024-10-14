package com.example.voyagesynccapstone.controllers;

import com.example.voyagesynccapstone.model.permissions.TripParticipantPermissions;
import com.example.voyagesynccapstone.services.TripParticipantService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/trip-participants")
public class TripParticipantController {
    @Autowired
    private TripParticipantService tripParticipantService;

    @GetMapping("/permissions")
    public ResponseEntity<List<TripParticipantPermissions>> getAllPermissions() {
        List<TripParticipantPermissions> permissions = tripParticipantService.getAllPermissions();
        return ResponseEntity.ok(permissions);
    }

    @GetMapping("/permissions/{userId}")
    public ResponseEntity<TripParticipantPermissions> getPermissionByUserId(@PathVariable ObjectId userId) {
        TripParticipantPermissions permissions = tripParticipantService.getPermissionByUserId(userId);
        return ResponseEntity.ok(permissions);
    }

    @PostMapping("/permissions")
    public ResponseEntity<TripParticipantPermissions> createPermission(@RequestBody TripParticipantPermissions permissions) {
        TripParticipantPermissions createdPermissions = tripParticipantService.createPermission(permissions);
        return ResponseEntity.ok(createdPermissions);
    }

    @DeleteMapping("/permissions/{userId}")
    public ResponseEntity<Void> deletePermission(@PathVariable ObjectId userId) {
        tripParticipantService.deletePermission(userId);
        return ResponseEntity.noContent().build();
    }
}
