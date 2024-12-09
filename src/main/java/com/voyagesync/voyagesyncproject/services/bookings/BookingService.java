package com.voyagesync.voyagesyncproject.services.bookings;

import com.voyagesync.voyagesyncproject.enums.ConfirmationStatus;
import com.voyagesync.voyagesyncproject.models.bookings.Bookings;
import com.voyagesync.voyagesyncproject.repositories.bookings.BookingsRepository;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class BookingService{
    private final BookingsRepository bookingsRepository;
    public BookingService(final BookingsRepository bookingsRepository) {
        this.bookingsRepository = bookingsRepository;
    }

    public List<Bookings> getAllBookings() {
        return bookingsRepository.findAll();
    }

    public Bookings getBookingById(final ObjectId id) {
        return bookingsRepository.findById(id).orElse(null);
    }

    public List<Bookings> getByConfirmationStatus(ConfirmationStatus status) {
        return bookingsRepository.findByConfirmationStatus(status);
    }

    public List<Bookings> getByDateOfBookings(LocalDate date) {
        return bookingsRepository.findByBookingDate(date);
    }

    public List<Bookings> getByNumberOfParticipants(int numberOfParticipants) {
        return bookingsRepository.findByNumberOfParticipants(numberOfParticipants);
    }

    //Create Booking
    public Bookings createBooking(Bookings booking) {
        return bookingsRepository.save(booking);
    }

    public List<Bookings> getByVendorId(ObjectId vendorId) {
        // Query bookings repository with ObjectId
        return bookingsRepository.findByVendorId(vendorId);
    }

    public Bookings updateBookingStatus(ObjectId bookingId, ConfirmationStatus newStatus) {
        Bookings booking = bookingsRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setConfirmationStatus(newStatus);
        return bookingsRepository.save(booking);
    }

    public Bookings rejectBooking(ObjectId bookingId) {
        Bookings booking = bookingsRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setConfirmationStatus(ConfirmationStatus.REJECTED);
        return bookingsRepository.save(booking);
    }

    public Bookings rescheduleBooking(ObjectId bookingId, LocalDate newDate, LocalTime newTime) {
        Bookings booking = bookingsRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setBookingDate(newDate);
        booking.setBookingTime(newTime);
        booking.setConfirmationStatus(ConfirmationStatus.RESCHEDULED);
        return bookingsRepository.save(booking);
    }

    //newly added for filtering on frontend (12/8/2024)
    public List<Bookings> getByVendorIdAndStatus(ObjectId vendorId, ConfirmationStatus status) {
        return bookingsRepository.findByVendorIdAndConfirmationStatus(vendorId, status);
    }

}
