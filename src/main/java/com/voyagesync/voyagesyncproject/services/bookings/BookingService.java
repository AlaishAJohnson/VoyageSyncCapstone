package com.voyagesync.voyagesyncproject.services.bookings;

import com.voyagesync.voyagesyncproject.enums.ConfirmationStatus;
import com.voyagesync.voyagesyncproject.models.bookings.Bookings;
import com.voyagesync.voyagesyncproject.repositories.bookings.BookingsRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class BookingService {
    private final BookingsRepository bookingsRepository;
    public BookingService(final BookingsRepository bookingsRepository) {
        this.bookingsRepository = bookingsRepository;
    }

    public List<Bookings> getAllBookings() {
        return bookingsRepository.findAll();
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
}
