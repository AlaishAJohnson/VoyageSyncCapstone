package com.voyagesync.voyagesyncproject.services.bookings;

import com.voyagesync.voyagesyncproject.models.bookings.Bookings;
import com.voyagesync.voyagesyncproject.repositories.bookings.BookingsRepository;
import org.springframework.stereotype.Service;

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
}
