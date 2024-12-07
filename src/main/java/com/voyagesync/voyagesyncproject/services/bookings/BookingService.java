package com.voyagesync.voyagesyncproject.services.bookings;

import com.voyagesync.voyagesyncproject.enums.ConfirmationStatus;
import com.voyagesync.voyagesyncproject.models.bookings.Bookings;
import com.voyagesync.voyagesyncproject.models.bookings.Services;
import com.voyagesync.voyagesyncproject.repositories.bookings.BookingsRepository;
import com.voyagesync.voyagesyncproject.repositories.bookings.ServiceRepository;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class BookingService {
    private final BookingsRepository bookingsRepository;
    private final ServiceRepository serviceRepository;

    public BookingService(final BookingsRepository bookingsRepository, final ServiceRepository serviceRepository) {
        this.bookingsRepository = bookingsRepository;
        this.serviceRepository = serviceRepository;
    }

    // Helper method to enrich bookings with Service Name
    private void enrichWithServiceName(Bookings booking) {
        Optional<Services> service = serviceRepository.findById(booking.getServiceId());
        service.ifPresent(value -> booking.setServiceName(value.getServiceName())); // Ensure serviceName is set
    }

    // Fetch all bookings and enrich them with Service Name
    public List<Bookings> getAllBookings() {
        List<Bookings> bookings = bookingsRepository.findAll();
        bookings.forEach(this::enrichWithServiceName);
        return bookings;
    }

    // Fetch bookings by Confirmation Status and enrich with Service Name
    public List<Bookings> getByConfirmationStatus(ConfirmationStatus status) {
        List<Bookings> bookings = bookingsRepository.findByConfirmationStatus(status);
        bookings.forEach(this::enrichWithServiceName);
        return bookings;
    }

    // Fetch bookings by Date and enrich with Service Name
    public List<Bookings> getByDateOfBookings(LocalDate date) {
        List<Bookings> bookings = bookingsRepository.findByBookingDate(date);
        bookings.forEach(this::enrichWithServiceName);
        return bookings;
    }

    // Fetch bookings by Number of Participants and enrich with Service Name
    public List<Bookings> getByNumberOfParticipants(int numberOfParticipants) {
        List<Bookings> bookings = bookingsRepository.findByNumberOfParticipants(numberOfParticipants);
        bookings.forEach(this::enrichWithServiceName);
        return bookings;
    }

    // Fetch bookings by VendorId and enrich with Service Name
    public List<Bookings> getByVendorId(ObjectId vendorId) {
        List<Bookings> bookings = bookingsRepository.findByVendorId(vendorId);
        bookings.forEach(this::enrichWithServiceName);
        return bookings;
    }

    // Create a new booking
    public Bookings createBooking(Bookings booking) {
        return bookingsRepository.save(booking);
    }

    // Fetch a single booking by its ID and enrich with Service Name
    public Bookings getBookingById(ObjectId bookingId) {
        Optional<Bookings> booking = bookingsRepository.findById(bookingId);
        if (booking.isPresent()) {
            enrichWithServiceName(booking.get());
            return booking.get();
        }
        return null; // or throw an exception if booking is not found
    }
}
