package com.example.voyagesynccapstone.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "admins")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Admins {
    @Id
    private ObjectId adminID;
    private ObjectId userID; // reference to user entity
    private LocalDateTime dateAssigned;


}
