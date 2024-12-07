package com.voyagesync.voyagesyncproject.models.bookings;

import org.springframework.data.mongodb.core.mapping.Field;

public class ServiceDetails {

    @Field("openSlots")
    private int openSlots;
    @Field("duration")
    private String duration;

    @Field("typeOfService")
    private String typeOfService;

    @Field("timeFrame")  // The "timeFrame" field now stores a string
    private String timeFrame;  // Use String for time frame description

    // Constructor, getters, and setters
    public ServiceDetails() {
    }

    public ServiceDetails(int openSlots, String duration, String typeOfService, String timeFrame) {
        this.openSlots = openSlots;
        this.duration = duration;
        this.typeOfService = typeOfService;
        this.timeFrame = timeFrame;
    }

    public int getOpenSlots() {
        return openSlots;
    }

    public void setOpenSlots(int openSlots) {
        this.openSlots = openSlots;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public String getTypeOfService() {
        return typeOfService;
    }

    public void setTypeOfService(String typeOfService) {
        this.typeOfService = typeOfService;
    }

    public String getTimeFrame() {
        return timeFrame;
    }

    public void setTimeFrame(String timeFrame) {
        this.timeFrame = timeFrame;
    }
}
