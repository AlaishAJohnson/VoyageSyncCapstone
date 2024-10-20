package com.voyagesync.voyagesyncproject.controllers.bookings;

import com.voyagesync.voyagesyncproject.models.bookings.Bookings;
import com.voyagesync.voyagesyncproject.services.bookings.BookingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
public class BookingsController {
    private final BookingService bookingService;
    public BookingsController(final BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllBookings() {
        List<Bookings> bookingsList = bookingService.getAllBookings();
        List<Map<String, Object>> response = bookingsList.stream().map(booking -> {
            Map<String, Object> bookingMap = new LinkedHashMap<>();
            bookingMap.put("bookingId", booking.getBookingId().toHexString());
            bookingMap.put("serviceId", booking.getServiceId());
            bookingMap.put("vendorId", booking.getVendorId());
            bookingMap.put("bookingDate", booking.getBookingDate());
            bookingMap.put("bookingTime", booking.getBookingTime());
            bookingMap.put("confirmationStatus", booking.getConfirmationStatus());
            bookingMap.put("itineraryId", booking.getItineraryId());
            return bookingMap;
        }).toList();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
