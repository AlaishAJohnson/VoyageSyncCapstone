package com.voyagesync.voyagesyncproject.controllers.permission;

import com.voyagesync.voyagesyncproject.models.permissions.OrganizerPermissions;
import com.voyagesync.voyagesyncproject.services.permissions.OrganizerPermissionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/trips/organizer/permissions")
public class OrganizerPermissionController {
    private final OrganizerPermissionService organizerPermissionService;

    public OrganizerPermissionController(final OrganizerPermissionService organizerPermissionService) {
        this.organizerPermissionService = organizerPermissionService;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllOrganizerPermissions() {
        List<OrganizerPermissions> organizerPermissionsList = organizerPermissionService.getAllOrganizerPermissions();
        List<Map<String, Object>> response = organizerPermissionsList.stream().map(organizerPermissions -> {
            Map<String, Object> organizerPermissionList = new LinkedHashMap<>();
            organizerPermissionList.put("adminPermissionId", organizerPermissions.getOrganizerPermissionId());
            organizerPermissionList.put("adminPermissionName", organizerPermissions.getPermissionName());
            organizerPermissionList.put("adminPermissionDescription", organizerPermissions.getOrganizerPermissionDescription());
            return organizerPermissionList;
        }).toList();
        return new ResponseEntity<>(response, HttpStatus.OK);

    }
}
