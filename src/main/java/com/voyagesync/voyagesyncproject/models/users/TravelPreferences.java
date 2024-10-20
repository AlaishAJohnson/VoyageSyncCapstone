package com.voyagesync.voyagesyncproject.models.users;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.TypeAlias;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "Travel-Preferences")
@TypeAlias("")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TravelPreferences {
    @Id
    private ObjectId preferenceId;
    private List<String> activities;
    private List<String> food;
    private List<String> weather;

}
