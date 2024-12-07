package com.voyagesync.voyagesyncproject.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String username;
    private String password;
    private String phoneNumber;
}
