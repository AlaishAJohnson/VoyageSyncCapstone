package com.voyagesync.voyagesyncproject.services.permissions;

import com.voyagesync.voyagesyncproject.models.permissions.VendorPermissions;
import com.voyagesync.voyagesyncproject.repositories.permissions.VendorPermissionRepository;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class VendorPermissionService {
    private final VendorPermissionRepository vendorPermissionRepository;
    public VendorPermissionService(final VendorPermissionRepository vendorPermissionRepository) {
        this.vendorPermissionRepository = vendorPermissionRepository;
    }

    public List<VendorPermissions> getAllVendorPermissions() {
        return vendorPermissionRepository.findAll();
    }




}
