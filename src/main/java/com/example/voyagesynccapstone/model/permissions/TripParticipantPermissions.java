package com.example.voyagesynccapstone.model.permissions;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "trip_participant_permissions")
@Data
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
public class TripParticipantPermissions extends Permissions {
    private boolean canVoteOnItinerary; // Vote on selected activities
    private boolean canCommunicateWithOrganizer; // Send messages to the trip organizer
    private boolean canViewItinerary; // View the trip itinerary
    private boolean canJoinTrip; // join trips invited by organizer
    private boolean canProvideFeedback; // provide feedback on services
    private List<String> permissions;
}
