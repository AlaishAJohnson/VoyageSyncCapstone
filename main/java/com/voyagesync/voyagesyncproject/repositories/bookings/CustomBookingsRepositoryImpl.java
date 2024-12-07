package com.voyagesync.voyagesyncproject.repositories.bookings;

import com.voyagesync.voyagesyncproject.models.bookings.Bookings;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class CustomBookingsRepositoryImpl implements CustomBookingsRepository {

    @Autowired
    private MongoTemplate mongoTemplate;

    @Override
    public List<Bookings> findBookingsWithServiceName(ObjectId vendorId) {
        // Aggregation pipeline
        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.match(Criteria.where("vendorId").is(vendorId)), // Filter by vendorId
                Aggregation.lookup("services", "serviceId", "_id", "serviceInfo"), // Join with Services collection
                Aggregation.unwind("serviceInfo"), // Flatten the serviceInfo array
                Aggregation.project("bookingId", "serviceId", "vendorId", "bookingDate", "bookingTime", "confirmationStatus", "itineraryId", "serviceInfo.serviceName") // Include serviceName
        );

        AggregationResults<Bookings> result = mongoTemplate.aggregate(aggregation, "bookings", Bookings.class);
        return result.getMappedResults();
    }
}
