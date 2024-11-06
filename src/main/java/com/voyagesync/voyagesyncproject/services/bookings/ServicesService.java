package com.voyagesync.voyagesyncproject.services.bookings;

import com.voyagesync.voyagesyncproject.dto.ServiceResponse;
import com.voyagesync.voyagesyncproject.models.bookings.ServiceAvailability;
import com.voyagesync.voyagesyncproject.models.bookings.Services;
import com.voyagesync.voyagesyncproject.models.users.Vendors;
import com.voyagesync.voyagesyncproject.repositories.bookings.ServiceRepository;
import com.voyagesync.voyagesyncproject.repositories.users.VendorRepository;
import org.bson.types.ObjectId;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ServicesService {

    private final ServiceRepository serviceRepository;
    private final VendorRepository vendorRepository;
    private final FeedbackService feedbackService;
    private final ServiceAvailabilityService serviceAvailabilityService;
    

    public ServicesService(final ServiceRepository serviceRepository, final VendorRepository vendorRepository, final FeedbackService feedbackService, ServiceAvailabilityService serviceAvailabilityService) {
        this.serviceRepository = serviceRepository;
        this.vendorRepository = vendorRepository;
        this.feedbackService = feedbackService;
        this.serviceAvailabilityService = serviceAvailabilityService;
    }

    public List<Services> getAllServices() {
        return serviceRepository.findAll();
    }

    public List<Services> getServicesById(List<ObjectId> serviceIds) {
        return serviceRepository.findByServiceIdIn(serviceIds);
    }
    public ServiceResponse getServiceById(ObjectId serviceId) {
        Services service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found"));

        return mapServiceWithVendorToResponse(service);
    }




    public double getAverageRatingForService(ObjectId serviceId) {
        List<Vendors> vendors = vendorRepository.findAll();
        double totalRating = 0.0;
        int count = 0;

        for (Vendors vendor : vendors) {
            // Check if the vendor's services contain the given serviceId
            if (vendor.getServices().contains(serviceId)) {
                // Get the average rating for this vendor
                double averageRating = feedbackService.getAverageRatingByVendorId(vendor.getVendorId());

                // Add to total rating and count
                totalRating += averageRating;
                count++; // Increment count of vendors contributing to the total rating
            }
        }

        // Return the average rating across all vendors that offer this service
        return count > 0 ? totalRating / count : 0.0; // Avoid division by zero
    }


    //nonsense
    public List<Services> getByLocation(String location){
        return serviceRepository.getByLocation(location);
    }

    public List<Services> getByPrice(String price){
        return serviceRepository.getByPrice(Double.parseDouble(price));
    }

    //idk
    
    public List<Services> getByAvailability(List<ObjectId> serviceAvailabilityIds){
        return serviceRepository.getByServiceAvailability(serviceAvailabilityIds);
    }

    /* 
    public List<Services> findByDate(LocalDate dateOfService){
        return serviceRepository.getByDateOfService(dateOfService);
    }

    public List<Services> findByDateTime(LocalDate dateOfService, LocalTime timeOfService){
        return serviceRepository.getByDateTime(dateOfService, timeOfService);
    }
    */

    //Location, price, availability, date, date/time

    /* */
    public List<ServiceResponse> getAllServicesWithVendorInfo() {
        List<Services> services = getAllServices();
        return services.stream()
                .map(this::mapServiceWithVendorToResponse)
                .collect(Collectors.toList());
    }


    private ServiceResponse mapServiceWithVendorToResponse(Services service) {
        List<Vendors> vendors = vendorRepository.findAll();
        Optional<Vendors> vendor = vendors.stream()
                .filter(v -> v.getServices().contains(service.getServiceId()))
                .findFirst();

        ServiceResponse response = new ServiceResponse();
        response.setServiceId(service.getServiceId().toHexString());
        response.setServiceName(service.getServiceName());
        response.setServiceDescription(service.getServiceDescription());
        response.setPrice(service.getPrice());

        vendor.ifPresent(v -> response.setVendorBusinessName(v.getBusinessName()));
        response.setAverageRating(getAverageRatingForService(service.getServiceId()));

        // Get service availability using the new method
        List<ServiceAvailability> availabilities = serviceAvailabilityService.getServiceAvailabilityByServiceId(service.getServiceId());

        List<Map<String, Object>> serviceAvailabilityList = availabilities.stream()
                .map(avail -> {
                    Map<String, Object> availabilityMap = new LinkedHashMap<>();
                    availabilityMap.put("serviceAvailabilityId", avail.getServiceAvailabilityId().toHexString());
                    availabilityMap.put("dateOfService", avail.getDateOfService());
                    availabilityMap.put("timeOfService", avail.getTimeOfService());
                    availabilityMap.put("isAvailable", avail.isAvailable());
                    availabilityMap.put("availableSlots", avail.getAvailableSlots());
                    return availabilityMap;
                })
                .collect(Collectors.toList());

        response.setServiceAvailability(serviceAvailabilityList);

        return response;
    }

    // vendors creating a service --> linked to serviceController & serviceRepo
    // ^^^ similar method for updating and deleting a service
    // all linked to the serviceController and serviceRepo
    // Create a new service (already restricted to vendors by controller)
    public Services createService(Services service) {
        //creating service availability for the new service before saving it
        serviceAvailabilityService.createAvailabilityForService(service);
        // save the new service
        return serviceRepository.save(service);
    }

    // Updating an existing service
    public Services updateService(String serviceId, Services service) {
        ObjectId id = new ObjectId(serviceId);
        //retrieve the existing service by its ID
        Optional<Services> existingServiceOptional = serviceRepository.findById(id);
        if (existingServiceOptional.isEmpty()) {
            throw new IllegalArgumentException("Service with ID " + serviceId + " not found.");
        }
        Services existingService = existingServiceOptional.get();

        // update the necessary fields in the service
        existingService.setServiceName(service.getServiceName());
        existingService.setServiceDescription(service.getServiceDescription());
        existingService.setPrice(service.getPrice());
        existingService.setLocation(service.getLocation());

        // update the service availability as well
        serviceAvailabilityService.updateAvailabilityForService(existingService, service);

        // save the updated service
        return serviceRepository.save(existingService);
    }

    // Deleting an existing service
    public void deleteService(String serviceId) {
        ObjectId id = new ObjectId(serviceId);

        if (!serviceRepository.existsById(id)) {
            throw new IllegalArgumentException("Service with ID " + serviceId + " not found.");
        }
        // handle the deletion of service availability before deleting the service
        serviceAvailabilityService.deleteAvailabilityForService(id);
        // delete the service
        serviceRepository.deleteById(id);
    }

}
