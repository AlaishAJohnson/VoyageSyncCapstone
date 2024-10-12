package com.example.voyagesynccapstone.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TravelPreference {
    @Id
    private ObjectId preferenceID;
    private List<String> activities;
    private List<String> food;
    private List<String> weather;
}
