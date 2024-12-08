package com.voyagesync.voyagesyncproject.controllers.bookings;

import com.voyagesync.voyagesyncproject.enums.ConfirmationStatus;
import com.voyagesync.voyagesyncproject.models.bookings.Bookings;
import com.voyagesync.voyagesyncproject.models.bookings.Services;
import com.voyagesync.voyagesyncproject.services.bookings.BookingService;
import com.voyagesync.voyagesyncproject.services.bookings.ServicesService;
import org.bson.types.ObjectId;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:8081")
@RequestMapping("/api/bookings")
public class BookingsController {
    private final BookingService bookingService;
    private final ServicesService servicesService;

    public BookingsController(final BookingService bookingService, final ServicesService servicesService) {
        this.bookingService = bookingService;
        this.servicesService = servicesService;
    }

    @GetMapping("/vendor/{vendorId}")
    public ResponseEntity<List<Map<String, Object>>> getByVendorId(@PathVariable ObjectId vendorId) {
        List<Bookings> bookings = bookingService.getByVendorId(vendorId);
        List<Map<String, Object>> response = bookings.stream().map(booking -> {
            Map<String, Object> bookingResponse = mapBookingsToResponse(booking);

            Services service = servicesService.getServiceByServiceId(booking.getServiceId());

            if (service != null) {
                bookingResponse.put("serviceName", service.getServiceName());
                bookingResponse.put("serviceDescription", service.getServiceDescription());
                bookingResponse.put("servicePrice", service.getPrice());
                bookingResponse.put("location", service.getLocation());
            }

            return bookingResponse;
        }).collect(Collectors.toList());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/")
    public ResponseEntity<List<Map<String, Object>>> getAllBookings() {
        List<Bookings> bookingsList = bookingService.getAllBookings();
        List<Map<String, Object>> response = bookingsList.stream().map(this::mapBookingsToResponse).collect(Collectors.toList());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getBookingById(@PathVariable ObjectId id) {
        Bookings booking = bookingService.getBookingById(id);
        Map<String, Object> response = mapBookingsToResponse(booking);
        return new ResponseEntity<>(response, HttpStatus.FOUND);
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

    /* Update Methods */
    @PutMapping("/accept/{bookingId}")
    public ResponseEntity<Map<String, Object>> acceptBooking(@PathVariable ObjectId bookingId) {
        Bookings updatedBooking = bookingService.updateBookingStatus(bookingId, ConfirmationStatus.CONFIRMED);
        Map<String, Object> response = mapBookingsToResponse(updatedBooking);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/cancel/{bookingId}")
    public ResponseEntity<Map<String, Object>> cancelBooking(@PathVariable ObjectId bookingId) {
        Bookings updatedBooking = bookingService.updateBookingStatus(bookingId, ConfirmationStatus.CANCELLED);
        Map<String, Object> response = mapBookingsToResponse(updatedBooking);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/reschedule/{bookingId}")
    public ResponseEntity<Map<String, Object>> rescheduleBooking(
            @PathVariable ObjectId bookingId,
            @RequestParam("newDate") LocalDate newDate,
            @RequestParam("newTime") LocalTime newTime) {

        try {
            Bookings updatedBooking = bookingService.rescheduleBooking(bookingId, newDate, newTime);
            Map<String, Object> response = mapBookingsToResponse(updatedBooking);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }


    @PutMapping("/reject/{bookingId}")
    public ResponseEntity<Map<String, Object>> rejectBooking(@PathVariable ObjectId bookingId) {
        try {
            Bookings rejectedBooking = bookingService.rejectBooking(bookingId);

            Map<String, Object> response = mapBookingsToResponse(rejectedBooking);

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    /* HELPER FUNCTIONS */
    private Map<String, Object> mapBookingsToResponse(Bookings bookings) {
        Map<String, Object> bookingMap = new LinkedHashMap<>();
        bookingMap.put("bookingId", bookings.getBookingId().toHexString());
        bookingMap.put("serviceId", bookings.getServiceId().toHexString());
        bookingMap.put("vendorId", bookings.getVendorId().toHexString());
        bookingMap.put("bookingDate", bookings.getBookingDate());
        bookingMap.put("bookingTime", bookings.getBookingTime());
        bookingMap.put("confirmationStatus", bookings.getConfirmationStatus());
        bookingMap.put("itineraryId", bookings.getItineraryId());
        return bookingMap;
    }
}
