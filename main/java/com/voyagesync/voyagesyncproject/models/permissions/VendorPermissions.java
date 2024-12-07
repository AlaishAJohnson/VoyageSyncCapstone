package com.voyagesync.voyagesyncproject.models.permissions;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.TypeAlias;
import org.springframework.data.mongodb.core.mapping.Document;


@Document(collection ="VendorPermissions")
@TypeAlias("")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VendorPermissions {
    @Id
    private ObjectId permissionId;
    private String permissionName;
    private String vendorPermissionDescription;
}
