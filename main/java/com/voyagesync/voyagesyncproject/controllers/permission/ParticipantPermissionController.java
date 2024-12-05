package com.voyagesync.voyagesyncproject.controllers.permission;

import com.voyagesync.voyagesyncproject.models.permissions.ParticipantPermissions;
import com.voyagesync.voyagesyncproject.services.permissions.ParticipantPermissionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/trips/participants/permissions")
@CrossOrigin(origins = "http://localhost:8081")
public class ParticipantPermissionController {
    private final ParticipantPermissionService participantPermissionService;
    public ParticipantPermissionController(final ParticipantPermissionService participantPermissionService) {
        this.participantPermissionService = participantPermissionService;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllParticipantPermissions() {
        List<ParticipantPermissions> participantPermissionsList = participantPermissionService.getAllParticipantPermissions();
        List<Map<String, Object>> response = participantPermissionsList.stream().map(participantPermissions -> {
            Map<String, Object> participantPermissionList = new LinkedHashMap<>();
            participantPermissionList.put("adminPermissionId", participantPermissions.getParticipantPermissionId());
            participantPermissionList.put("adminPermissionName", participantPermissions.getPermissionName());
            participantPermissionList.put("adminPermissionDescription", participantPermissions.getParticipantPermissionDescription());
            return participantPermissionList;
        }).toList();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
