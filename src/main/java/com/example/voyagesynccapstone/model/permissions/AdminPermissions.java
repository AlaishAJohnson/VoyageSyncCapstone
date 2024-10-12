package com.example.voyagesynccapstone.model.permissions;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "admin_permissions")
@Data
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
public class AdminPermissions extends Permissions {
    private boolean canManageUsers; // CRUD user accounts
    private boolean canManageVendors; // CRUD vendor accounts
    private boolean canManageTrips; // manage all trips
    private boolean canViewReports; // access reports on services & users
    private boolean canConfigureSettings; // change app settings
    private List<String> permissions;
}
