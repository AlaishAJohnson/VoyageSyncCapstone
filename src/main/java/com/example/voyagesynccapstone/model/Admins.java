package com.example.voyagesynccapstone.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "admins")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Admins {
    @Id
    private String adminID;
    private String userID; // reference to user entity
    private LocalDateTime dateAssigned;


}
