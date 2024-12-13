package com.voyagesync.voyagesyncproject.services.trips;

import com.voyagesync.voyagesyncproject.enums.ConfirmationStatus;
import com.voyagesync.voyagesyncproject.models.bookings.Bookings;
import com.voyagesync.voyagesyncproject.models.bookings.Services;
import com.voyagesync.voyagesyncproject.models.trips.Itinerary;
import com.voyagesync.voyagesyncproject.models.trips.Trips;
import com.voyagesync.voyagesyncproject.models.trips.Vote;
import com.voyagesync.voyagesyncproject.repositories.bookings.BookingsRepository;
import com.voyagesync.voyagesyncproject.repositories.bookings.ServiceRepository;
import com.voyagesync.voyagesyncproject.repositories.trips.ItineraryRepository;
import com.voyagesync.voyagesyncproject.repositories.trips.TripRepository;
import com.voyagesync.voyagesyncproject.repositories.trips.VoteRepository;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ItineraryService {
    private final ItineraryRepository itineraryRepository;
    private final ServiceRepository serviceRepository;
    private final VoteRepository voteRepository;
    private final TripRepository tripRepository;
    private final BookingsRepository bookingsRepository;
    public ItineraryService(final ItineraryRepository itineraryRepository, ServiceRepository serviceRepository, VoteRepository voteRepository, TripRepository tripRepository, BookingsRepository bookingsRepository) {
        this.itineraryRepository = itineraryRepository;
        this.serviceRepository = serviceRepository;
        this.voteRepository = voteRepository;
        this.tripRepository = tripRepository;
        this.bookingsRepository = bookingsRepository;
    }

    public List<Itinerary> getAllItineraries(){
        return itineraryRepository.findAll();
    }

    public Itinerary getItineraryById(final ObjectId id) {
        return itineraryRepository.findByItineraryId(id);
    }
    public List<Map<String, Object>> getItineraryItemsByTripAndCreator(String tripId, String creatorId) {

        ObjectId tripObjId  = new ObjectId(tripId);
        ObjectId creatorIdObjId = new ObjectId(creatorId);
        List<Itinerary> itineraryItems = itineraryRepository.findByTripIdAndCreatorId(tripObjId, creatorIdObjId);

        return itineraryItems.stream().map(this::mapItineraryToResponse).collect(Collectors.toList());
    }
    public List<Map<String, Object>> getItineraryByTripId(String tripId) {
        ObjectId tripObjId  = new ObjectId(tripId);
        List<Itinerary> itineraryList = itineraryRepository.findByTripId(tripObjId);
        return itineraryList.stream().map(this::mapItineraryToResponse).collect(Collectors.toList());
    }

    public List<Map<String, Object>> getItinerariesWithVoteStatus(ObjectId tripId, ObjectId userId) {
        List<Itinerary> itineraries = itineraryRepository.findByTripId(tripId);

        return itineraries.stream().map(itinerary -> {
            boolean userHasVoted = voteRepository.existsByItineraryIdAndUserId(itinerary.getItineraryId(), userId);

            // Map the itinerary fields and vote status into a response map
            Map<String, Object> response = new HashMap<>();
            response.put("itineraryId", itinerary.getItineraryId().toHexString());
            if (itinerary.getServiceId() != null) {
                response.put("serviceId", itinerary.getServiceId().toHexString());

                Optional<Services> optionalService = serviceRepository.findById(itinerary.getServiceId());
                optionalService.ifPresent(service -> {
                    response.put("serviceName", service.getServiceName());
                    response.put("location", service.getLocation());
                    response.put("price", service.getPrice());
                    response.put("vendorId", service.getVendorId().toHexString());
                });
            } else {
                response.put("serviceId", null);
                response.put("serviceName", null);
                response.put("location", null);
                response.put("price", null);
            }
            response.put("dateOfService", itinerary.getDateOfService());
            response.put("timeOfService", itinerary.getTimeOfService());
            response.put("confirmationStatus", itinerary.getConfirmationStatus());
            response.put("voteCount", itinerary.getVoteCount());
            response.put("creatorId", itinerary.getCreatorId().toHexString());
            response.put("tripId", itinerary.getTripId().toHexString());
            response.put("userHasVoted", userHasVoted);

            return response;
        }).collect(Collectors.toList());
    }

    public void checkAndBookItinerary(String itineraryId, ObjectId tripId) {

        ObjectId itineraryObjId = new ObjectId(itineraryId);

        Itinerary itineraryItem = itineraryRepository.findById(itineraryObjId)
                .orElseThrow(() -> new RuntimeException("Itinerary not found"));

        Trips trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        List<ObjectId> memberIds = trip.getMemberIds();
        ObjectId organizerId = trip.getOrganizerId();
        assert memberIds != null;

        if (!memberIds.contains(organizerId)) {
            memberIds.add(organizerId);
        }

        if (itineraryItem.getVotes().size() >= memberIds.size() && checkMajorityVotes(itineraryId)) {

            itineraryItem.setTimeOfService(LocalTime.now());
            itineraryRepository.save(itineraryItem);

            if (!trip.getItinerary().contains(itineraryObjId)) {
                trip.getItinerary().add(itineraryObjId);
                System.out.println("Added itinerary ID to trip itinerary list: " + itineraryObjId);
            } else {
                System.out.println("Itinerary ID already exists in trip itinerary list.");
            }

            tripRepository.save(trip);
            System.out.println("Trip saved with updated itinerary.");

            Bookings newBooking = new Bookings();
            newBooking.setServiceId(itineraryItem.getServiceId());
            newBooking.setBookingDate(LocalDate.now());
            newBooking.setBookingTime(LocalTime.now());
            newBooking.setConfirmationStatus(ConfirmationStatus.PENDING);
            newBooking.setItineraryId(itineraryObjId);
            newBooking.setNumberOfParticipants(memberIds.size());

            if (itineraryItem.getServiceId() != null) {
                Optional<Services> optionalService = serviceRepository.findById(itineraryItem.getServiceId());
                optionalService.ifPresent(service -> {
                    newBooking.setVendorId(service.getVendorId());
                    System.out.println("Associated vendor ID: " + service.getVendorId());
                });
            } else {
                System.out.println("Service ID not found in itinerary.");
            }

            bookingsRepository.save(newBooking);
            System.out.println("New booking created with status PENDING: " + newBooking.getBookingId());
        } else {
            System.out.println("Voting not complete or majority not reached.");
        }
    }

    public boolean addToVote(String itineraryId, String userId, boolean vote) {
        ObjectId itineraryObjId = new ObjectId(itineraryId);
        Itinerary itinerary = itineraryRepository.findById(itineraryObjId)
                .orElseThrow(() -> new RuntimeException("Itinerary not found"));

        Optional<Vote> existingVote = voteRepository.findByUserIdAndItineraryId(new ObjectId(userId), itineraryObjId);
        if (existingVote.isPresent()) {
            return false;
        }

        Vote newVote = new Vote();
        newVote.setUserId(new ObjectId(userId));
        newVote.setVote(vote);
        newVote.setItineraryId(itineraryObjId);

        voteRepository.save(newVote);

        itinerary.getVotes().add(newVote.getVoteId());
        itinerary.setVoteCount(itinerary.getVoteCount() + 1);

        itineraryRepository.save(itinerary);

        return true;
    }




    private Map<String, Object> mapItineraryToResponse(Itinerary itineraryItem) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("itineraryId", itineraryItem.getItineraryId().toHexString());

        if (itineraryItem.getServiceId() != null) {
            response.put("serviceId", itineraryItem.getServiceId().toHexString());

            Optional<Services> optionalService = serviceRepository.findById(itineraryItem.getServiceId());
            optionalService.ifPresent(service -> {
                response.put("serviceName", service.getServiceName());
                response.put("location", service.getLocation());
                response.put("price", service.getPrice());
            });
        } else {
            response.put("serviceId", null);
            response.put("serviceName", null);
            response.put("location", null);
            response.put("price", null);
        }

        response.put("dateOfService", itineraryItem.getDateOfService());
        response.put("timeOfService", itineraryItem.getTimeOfService());
        response.put("confirmationStatus", itineraryItem.getConfirmationStatus());
        response.put("voteCount", itineraryItem.getVoteCount());

        if (itineraryItem.getCreatorId() != null) {
            response.put("creatorId", itineraryItem.getCreatorId().toHexString());
        } else {
            response.put("creatorId", null);
        }

        if (itineraryItem.getVotes() != null) {
            response.put("votes", itineraryItem.getVotes());
        }

        return response;
    }

    public boolean updateVoteCount(String itineraryId, String userId, boolean vote) {
        ObjectId itineraryIdObjId = new ObjectId(itineraryId);
        Itinerary itinerary = itineraryRepository.findById(itineraryIdObjId).orElse(null);


        ObjectId userIdObjId = new ObjectId(userId);
        Vote newVote = new Vote();
        newVote.setUserId(userIdObjId);
        newVote.setVote(vote);
        newVote.setItineraryId(itineraryIdObjId);
        voteRepository.save(newVote);

        assert itinerary != null;
        itinerary.getVotes().add(newVote.getVoteId());
        itinerary.setVoteCount(itinerary.getVoteCount()+1);
        itineraryRepository.save(itinerary);

        return true;
    }

    public int getYesVoteCount(String itineraryId) {
        ObjectId itineraryObjId = new ObjectId(itineraryId);
        Itinerary itinerary = itineraryRepository.findById(itineraryObjId)
                .orElseThrow(() -> new RuntimeException("Itinerary not found"));

        List<ObjectId> voteIds = itinerary.getVotes();
        List<Vote> votes = voteRepository.findAllById(voteIds);

        return (int) votes.stream().filter(Vote::isVote).count();
    }

    public boolean checkMajorityVotes(String itineraryId) {
        ObjectId itineraryObjId = new ObjectId(itineraryId);
        Itinerary itinerary = itineraryRepository.findById(itineraryObjId)
                .orElseThrow(() -> new RuntimeException("Itinerary not found"));
        List<ObjectId> voteIds = itinerary.getVotes();
        List<Vote> votes = voteRepository.findAllById(voteIds);
        long yesVotes = votes.stream().filter(vote -> vote.isVote()).count();
        long noVotes = votes.size() - yesVotes;
        return yesVotes > noVotes;
    }

    public void addToItinerary(String itineraryId) {
        ObjectId itineraryObjId = new ObjectId(itineraryId);
        Itinerary itinerary = itineraryRepository.findById(itineraryObjId)
                .orElseThrow(() -> new RuntimeException("Itinerary not found"));

        Trips trip = tripRepository.findById(itinerary.getTripId())
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        trip.getItinerary().add(itinerary.getItineraryId());
        tripRepository.save(trip);
    }

    public void deleteItineraryItem(String itineraryId) {
        ObjectId itineraryObjId = new ObjectId(itineraryId);
        itineraryRepository.deleteById(itineraryObjId);
    }

}
