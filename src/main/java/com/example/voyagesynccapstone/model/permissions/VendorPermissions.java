package com.example.voyagesynccapstone.model.permissions;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "vendor_permissions")
@Data
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
public class VendorPermissions extends Permissions {
    private boolean canListServices; // List services/activities they offer
    private boolean canManageBookings; // View and manage bookings made by participants
    private boolean canCommunicateWithOrganizers; // Send messages to trip organizers
    private boolean canUpdateServiceDetails; // Update service information
    private List<String> permissions; // List of specific permissions assigned
}
