package com.voyagesync.voyagesyncproject.controllers.permission;

import com.voyagesync.voyagesyncproject.models.permissions.UserPermissions;
import com.voyagesync.voyagesyncproject.services.permissions.UserPermissionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users/permissions")
public class UserPermissionController {
    private final UserPermissionService userPermissionService;
    public UserPermissionController(final UserPermissionService userPermissionService) {
        this.userPermissionService = userPermissionService;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllUserPermissions() {
        List<UserPermissions> userPermissionsList = userPermissionService.getAllUserPermissions();
        List<Map<String, Object>> response = userPermissionsList.stream().map(userPermissions -> {
            Map<String, Object> userPermissionMap = new LinkedHashMap<>();
            userPermissionMap.put("userPermissionId", userPermissions.getUserPermissionId());
            userPermissionMap.put("permissionName", userPermissions.getPermissionName());
            userPermissionMap.put("userPermissionDescription", userPermissions.getUserPermissionDescription());
            return userPermissionMap;
        }).toList();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
