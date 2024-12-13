package com.voyagesync.voyagesyncproject.services.trips;


import com.voyagesync.voyagesyncproject.models.trips.Itinerary;
import com.voyagesync.voyagesyncproject.models.trips.Vote;
import com.voyagesync.voyagesyncproject.repositories.trips.ItineraryRepository;
import com.voyagesync.voyagesyncproject.repositories.trips.VoteRepository;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class VoteService {

    private final VoteRepository voteRepository;

    private final ItineraryRepository itineraryRepository;

    public VoteService(VoteRepository voteRepository, ItineraryRepository itineraryRepository) {
        this.voteRepository = voteRepository;
        this.itineraryRepository = itineraryRepository;
    }

    public boolean voteOnItinerary(ObjectId itineraryId, ObjectId userId, boolean voteValue) {
        // Check if the itinerary exists
        Optional<Itinerary> itineraryOpt = itineraryRepository.findById(itineraryId);

        if (itineraryOpt.isPresent()) {
            Itinerary itinerary = itineraryOpt.get();

            // Check if the user has already voted
            Optional<Vote> existingVote = voteRepository.findByUserIdAndItineraryId(userId, itineraryId);
            if (existingVote.isPresent()) {
                // Update the existing vote
                Vote existing = existingVote.get();
                existing.setVote(voteValue);
                voteRepository.save(existing);
            } else {
                // Create a new vote
                Vote newVote = new Vote();
                newVote.setUserId(userId);
                newVote.setVote(voteValue);
                newVote.setItineraryId(itineraryId);
                voteRepository.save(newVote);

                // Add the new vote ID to the itinerary's list of votes
                itinerary.getVotes().add(newVote.getVoteId());
                itineraryRepository.save(itinerary);
            }

            // Update vote count for the itinerary
            long yesVotes = voteRepository.countByItineraryIdAndVote(itineraryId, true);
            long noVotes = voteRepository.countByItineraryIdAndVote(itineraryId, false);
            itinerary.setVoteCount(yesVotes - noVotes); // Update vote count (or adjust as needed)
            itineraryRepository.save(itinerary);

            return true;
        }

        return false;
    }
}
