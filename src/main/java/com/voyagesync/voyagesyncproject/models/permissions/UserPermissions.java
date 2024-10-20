package com.voyagesync.voyagesyncproject.models.permissions;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.TypeAlias;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "userPermission")
@TypeAlias("")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserPermissions {
    @Id
    public ObjectId userPermissionId;
    public String permissionName;
    public String userPermissionDescription;
}
