package com.example.voyagesynccapstone.controllers;

import com.example.voyagesynccapstone.model.permissions.Permissions;
import com.example.voyagesynccapstone.services.PermissionService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/permissions")
public class PermissionController {
   @Autowired
    private PermissionService permissionService;

    @GetMapping
    public ResponseEntity<List<Permissions>> getAllPermissions() {
        List<Permissions> permissions = permissionService.getAllPermissions();
        return ResponseEntity.ok(permissions);
    }

    @PostMapping("/create")
    public ResponseEntity<Permissions> createPermission(
            @RequestParam String permissionName,
            @RequestParam ObjectId userID
    ) {
        Permissions permission = permissionService.createPermission(permissionName, userID);
        return ResponseEntity.ok(permission);
    }
}
