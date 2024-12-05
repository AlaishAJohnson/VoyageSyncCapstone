package com.voyagesync.voyagesyncproject.controllers.vendorreports;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class VendorReportsDTO {
    private int bookingsCount;  // Number of bookings for the vendor
    private int servicesCount;  // Number of services offered by the vendor
    private int feedbackCount;  // Number of feedback entries for the vendor

    public int getBookingsCount() {
        return bookingsCount;
    }

    public void setBookingsCount(int bookingsCount) {
        this.bookingsCount = bookingsCount;
    }

    public int getServicesCount() {
        return servicesCount;
    }

    public void setServicesCount(int servicesCount) {
        this.servicesCount = servicesCount;
    }

    public int getFeedbackCount() {
        return feedbackCount;
    }

    public void setFeedbackCount(int feedbackCount) {
        this.feedbackCount = feedbackCount;
    }
}
