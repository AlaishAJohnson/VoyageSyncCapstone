package com.example.voyagesynccapstone.model.permissions;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "trip_organizer_permissions")
@Data
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
public class TripOrganizerPermissions extends Permissions {
    private boolean canEditTrip; // edit group trips they created
    private boolean canDeleteTrip; // delete trips the created
    private boolean canInviteParticipants; // invite users to join the trip
    private boolean canManageItinerary; // manage activities & services for the itinerary
    private boolean canSuggestItinerary; // suggest activities & services for the itinerary
    private boolean canCommunicateWithParticipants; // send messages to participants
    private boolean canTransferRole; // transfer their organizer role to another user
    private List<String> permissions;
}
