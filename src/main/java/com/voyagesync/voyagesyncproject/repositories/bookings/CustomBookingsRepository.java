package com.voyagesync.voyagesyncproject.repositories.bookings;

import com.voyagesync.voyagesyncproject.models.bookings.Bookings;
import org.bson.types.ObjectId;

import java.util.List;

public interface CustomBookingsRepository {
    List<Bookings> findBookingsWithServiceName(ObjectId vendorId);
}
