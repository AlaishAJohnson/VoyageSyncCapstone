package com.voyagesync.voyagesyncproject.controllers.permission;

import com.voyagesync.voyagesyncproject.models.permissions.VendorPermissions;
import com.voyagesync.voyagesyncproject.services.permissions.VendorPermissionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/vendors/permissions")
public class VendorPermissionController {

    private final VendorPermissionService vendorPermissionService;


    public VendorPermissionController(final VendorPermissionService vendorPermissionService) {
        this.vendorPermissionService = vendorPermissionService;

    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllVendorPermissions() {
        List<VendorPermissions> vendorPermissionsList = vendorPermissionService.getAllVendorPermissions();
        List<Map<String, Object>> response = vendorPermissionsList.stream().map(vendorPermissions -> {
            Map<String, Object> vendorPermissionMap = new LinkedHashMap<>();
            vendorPermissionMap.put("vendorPermissionId", vendorPermissions.getPermissionId());
            vendorPermissionMap.put("permissionName", vendorPermissions.getPermissionName());
            vendorPermissionMap.put("vendorPermissionDescription", vendorPermissions.getVendorPermissionDescription());
            return vendorPermissionMap;
        }).toList();
        return new ResponseEntity<>(response, HttpStatus.OK);

    }
}
