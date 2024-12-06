package com.voyagesync.voyagesyncproject.controllers.bookings;

import com.voyagesync.voyagesyncproject.enums.ConfirmationStatus;
import com.voyagesync.voyagesyncproject.models.bookings.Bookings;
import com.voyagesync.voyagesyncproject.services.bookings.BookingService;
import org.bson.types.ObjectId;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:8081")
@RequestMapping("/api/bookings")
public class BookingsController {
    private final BookingService bookingService;

    public BookingsController(final BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping("/vendor/{vendorId}")
    public ResponseEntity<List<Map<String, Object>>> getByVendorId(@PathVariable ObjectId vendorId) {
        List<Bookings> bookings = bookingService.getByVendorId(vendorId);
        List<Map<String, Object>> response = bookings.stream().map(this::mapBookingsToResponse).collect(Collectors.toList());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllBookings() {
        List<Bookings> bookingsList = bookingService.getAllBookings();
        List<Map<String, Object>> response = bookingsList.stream().map(this::mapBookingsToResponse).collect(Collectors.toList());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/status/{confirmationStatus}")
    public ResponseEntity<List<Map<String, Object>>> getByConfirmationStatus(@PathVariable String confirmationStatus) {
        ConfirmationStatus status = ConfirmationStatus.valueOf(confirmationStatus.toUpperCase());
        List<Bookings> bookings = bookingService.getByConfirmationStatus(status);
        List<Map<String, Object>> response = bookings.stream().map(this::mapBookingsToResponse).collect(Collectors.toList());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/date")
    public ResponseEntity<List<Map<String, Object>>> getByDateOfBookings(@RequestParam("date") LocalDate date) {
        List<Bookings> bookings = bookingService.getByDateOfBookings(date);
        List<Map<String, Object>> response = bookings.stream().map(this::mapBookingsToResponse).collect(Collectors.toList());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/participants/{numberOfParticipants}")
    public ResponseEntity<List<Map<String, Object>>> getByNumberOfParticipants(@PathVariable int numberOfParticipants) {
        List<Bookings> bookings = bookingService.getByNumberOfParticipants(numberOfParticipants);
        List<Map<String, Object>> response = bookings.stream().map(this::mapBookingsToResponse).collect(Collectors.toList());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Create Booking here
    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> createBooking(@RequestBody Bookings booking) {
        Bookings createdBooking = bookingService.createBooking(booking);
        Map<String, Object> response = mapBookingsToResponse(createdBooking);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /* HELPER FUNCTIONS */
    private Map<String, Object> mapBookingsToResponse(Bookings bookings) {
        Map<String, Object> bookingMap = new LinkedHashMap<>();
        bookingMap.put("bookingId", bookings.getBookingId().toHexString());
        bookingMap.put("serviceId", bookings.getServiceId());
        bookingMap.put("vendorId", bookings.getVendorId());
        bookingMap.put("bookingDate", bookings.getBookingDate());
        bookingMap.put("bookingTime", bookings.getBookingTime());
        bookingMap.put("confirmationStatus", bookings.getConfirmationStatus());
        bookingMap.put("itineraryId", bookings.getItineraryId());
        return bookingMap;
    }
}