package com.voyagesync.voyagesyncproject.controllers.permission;

import com.voyagesync.voyagesyncproject.models.permissions.AdminPermissions;
import com.voyagesync.voyagesyncproject.services.permissions.AdminPermissionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/permissions")
public class AdminPermissionController {
    private final AdminPermissionService adminPermissionService;
    public AdminPermissionController(final AdminPermissionService adminPermissionService) {
        this.adminPermissionService = adminPermissionService;
    }
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllAdminPermissions() {
        List<AdminPermissions> adminPermissionsList = adminPermissionService.getAllAdminPermissions();
        List<Map<String, Object>> response = adminPermissionsList.stream().map(adminPermissions -> {
            Map<String, Object> adminPermissionList = new LinkedHashMap<>();
            adminPermissionList.put("adminPermissionId", adminPermissions.getAdminPermissionId());
            adminPermissionList.put("adminPermissionName", adminPermissions.getPermissionName());
            adminPermissionList.put("adminPermissionDescription", adminPermissions.getAdminPermissionDescription());
            return adminPermissionList;
        }).toList();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // define admin permission (deactivate/activate users)
}
