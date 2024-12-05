package com.voyagesync.voyagesyncproject.controllers.users;

import com.voyagesync.voyagesyncproject.models.users.Admins;
import com.voyagesync.voyagesyncproject.services.users.AdminService;
import org.bson.types.ObjectId;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admins")
@CrossOrigin(origins = "http://localhost:8081")
public class AdminController {

    private final AdminService adminService;
    public AdminController(final AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllAdmin() {

        List<Admins> adminsList = adminService.getAllAdmins();
        List<Map<String, Object>> response = adminsList.stream().map(admins -> {
            Map<String, Object> adminMap = new LinkedHashMap<>();
            adminMap.put("adminId", admins.getAdminId().toHexString());
            adminMap.put("userId", admins.getUserId().toHexString());
            adminMap.put("permissionAssignmentDate", admins.getPermissionAssignmentDate());
            List<String> adminPermissionIds = admins.getAdminPermissions().stream().map(ObjectId::toHexString).collect(Collectors.toList());
            adminMap.put("adminPermissionIds", adminPermissionIds);
            return adminMap;
        }).toList();

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
