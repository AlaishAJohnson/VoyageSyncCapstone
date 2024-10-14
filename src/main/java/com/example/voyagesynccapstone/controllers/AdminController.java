package com.example.voyagesynccapstone.controllers;

import com.example.voyagesynccapstone.model.users.Admins;
import com.example.voyagesynccapstone.services.AdminService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/admins")
public class AdminController {
    @Autowired
    private AdminService adminService;

    @GetMapping("/{adminID}")
    public ResponseEntity<Admins> getAdminById(@PathVariable ObjectId adminID) {
        Admins admin = adminService.getAdminById(adminID);
        return ResponseEntity.ok(admin);
    }

    @PostMapping("/assign-permission")
    public ResponseEntity<String> assignPermissionToAdmin(
            @RequestParam ObjectId adminID, @RequestParam ObjectId permissionID) {
        adminService.assignPermission(adminID, permissionID);
        return ResponseEntity.ok("Permission assigned successfully.");
    }
}
