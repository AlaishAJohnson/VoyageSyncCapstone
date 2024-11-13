package com.voyagesync.voyagesyncproject.controllers.users;

import com.voyagesync.voyagesyncproject.dto.LoginRequest;
import com.voyagesync.voyagesyncproject.enums.VerificationStatus;
import com.voyagesync.voyagesyncproject.models.users.Admins;
import com.voyagesync.voyagesyncproject.models.users.TravelPreferences;
import com.voyagesync.voyagesyncproject.models.users.Users;
import com.voyagesync.voyagesyncproject.models.users.Vendors;
import com.voyagesync.voyagesyncproject.services.users.AdminService;
import com.voyagesync.voyagesyncproject.services.users.TravelPreferenceService;
import com.voyagesync.voyagesyncproject.services.users.UsersService;
import com.voyagesync.voyagesyncproject.services.users.VendorService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.bson.types.ObjectId;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/users")

public class UsersController {

    private final UsersService usersService;
    private final VendorService vendorService;
    private final AdminService adminService;
    private final TravelPreferenceService travelPreferenceService;

    public UsersController(final UsersService usersService, VendorService vendorService, AdminService adminService, TravelPreferenceService travelPreferenceService) {
        this.usersService = usersService;
        this.vendorService = vendorService;
        this.adminService = adminService;
        this.travelPreferenceService = travelPreferenceService;
    }

    /* GET METHODS */
    @GetMapping("/")
    public ResponseEntity<List<Map<String, Object>>> getAllUsers() {
        List<Users> userList = usersService.getAllUsers();
        List<Map<String, Object>> response = userList.stream().map(this::mapUserToResponse).collect(Collectors.toList());

        return new ResponseEntity<>( response, HttpStatus.OK);
    }
    @GetMapping("/{userId}")
    public ResponseEntity<Users> getUserById(@PathVariable String userId) {
        Users user = usersService.getUserById(userId);
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }

    @GetMapping("/name/{firstName}/{lastName}")
    public ResponseEntity<List<Map<String, Object>>> getUserByName(@PathVariable("firstName") String firstName, @PathVariable("lastName") String lastName) {
        try {
            List<Users> usersByName = usersService.getByFirstAndLastName(firstName, lastName);
            List<Map<String, Object>> response = usersByName.stream().map(this::mapUserToResponse).collect(Collectors.toList());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.emptyList());
        }
    }
    @GetMapping("/verificationStatus/{verificationStatus}")
    public ResponseEntity<List<Map<String, Object>>> getVerificationStatus(@PathVariable("verificationStatus") VerificationStatus verificationStatus) {
        try{
            VerificationStatus status = VerificationStatus.fromString(verificationStatus.name());
            List<Users> usersByStatus = usersService.getByVerificationStatus(status);
            List<Map<String, Object>> response = usersByStatus.stream().map(this::mapUserToResponse).collect(Collectors.toList());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.emptyList());
        }
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<?> getUserByUsername(@PathVariable("username") String username) {
        try {
            Users user = usersService.getByUsername(username);
            Map<String, Object> response = mapUserToResponse(user);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(String.format("User with username: '%s' not found", username));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error occurred while retrieving user: " + e.getMessage());
        }
    }

    @GetMapping("/phoneNumber/{phoneNumber}")
    public ResponseEntity<?> getUserByPhoneNumber(@PathVariable("phoneNumber") String phoneNumber) {
        try {
            Users user = usersService.getByPhoneNumber(phoneNumber);
            Map<String, Object> response = mapUserToResponse(user);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return  ResponseEntity.status(HttpStatus.NOT_FOUND).body(String.format("User with phone number: '%s' not found", phoneNumber));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error occurred while retrieving user: " + e.getMessage());
        }
    }

    @GetMapping("/role/{role}")
    public ResponseEntity<List<Map<String, Object>>> getUserByRole(@PathVariable("role") String role) {
        try{
            List<Users> usersList = usersService.getByRole(role);
            List<Map<String, Object>> response = usersList.stream().map(this::mapUserToResponse).collect(Collectors.toList());
            return new ResponseEntity<>( response, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.emptyList());
        }
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<?> getUserByEmail(@PathVariable("email") String email) {
        try {
            Users user = usersService.getByEmail(email);
            Map<String, Object> response = mapUserToResponse(user);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(String.format("User with email: '%s' not found", email));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error occurred while retrieving user: " + e.getMessage());
        }
    }




    /* POST METHODS */
    @PostMapping("/login")
    public ResponseEntity<Users> login(@RequestBody LoginRequest loginRequest) {
        try {
            Users user = usersService.login(loginRequest.getUsernameOrEmail(), loginRequest.getPassword());
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }


    @PostMapping("/create-user")
    public ResponseEntity<Map<String, Object>> createUser(@RequestBody Map<String, Object> userDetails) {
        try {
            String username = userDetails.get("username").toString();
            String email = userDetails.get("email").toString();
            String phoneNumber = userDetails.get("phoneNumber").toString();

            if (usersService.existByUsername(username)) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "Username already exists"));
            }

            if (usersService.existByEmail(email)) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "Email already exists"));
            }

            if (usersService.existByPhoneNumber(phoneNumber)) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "Phone number already exists"));
            }

            // Create a new user
            Users newUser = new Users();
            newUser.setFirstName(userDetails.get("firstName").toString());
            newUser.setLastName(userDetails.get("lastName").toString());
            newUser.setUsername(username);
            newUser.setEmail(email);
            newUser.setPhoneNumber(phoneNumber);
            newUser.setPassword(userDetails.get("password").toString());
            newUser.setRole(userDetails.get("role").toString());

            Users savedUser = usersService.createUser(newUser);

            // Handle additional role-specific data
            String role = newUser.getRole();
            if ("vendor".equals(role)) {
                Vendors newVendor = createVendor(userDetails, savedUser.getId());
                vendorService.createVendor(newVendor);
            } else if ("admin".equals(role)) {
                Admins newAdmin = new Admins();
                newAdmin.setUserId(savedUser.getId());
                adminService.createAdmin(newAdmin);
            }

            // Send back a response with user details
            Map<String, Object> response = new HashMap<>();
            response.put("message", "User created successfully");
            response.put("userId", savedUser.getId().toString());

            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(Map.of("message", "Failed to create user: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @PutMapping("/{userId}/linkPreferences/{preferencesId}")
    public ResponseEntity<String> linkPreferences(@PathVariable String userId, @PathVariable String preferencesId) {
        try {
            Optional<Users> userOptional = usersService.findUserById(userId);
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }

            Optional<TravelPreferences> preferencesOptional = travelPreferenceService.findById(preferencesId);
            if (preferencesOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Travel Preferences not found");
            }

            Users user = userOptional.get();
            TravelPreferences preferences = preferencesOptional.get();

            user.setTravelPreferences(preferences);
            usersService.updateUser(user);

            return new ResponseEntity<>("Travel preferences linked successfully.", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to link travel preferences: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // Create or Update Travel Preferences
    @PutMapping("/preferences/{preferencesId}")
    public ResponseEntity<TravelPreferences> updateTravelPreferences(@PathVariable String preferencesId, @RequestBody TravelPreferences newPreferences) {
        TravelPreferences updatedPreferences = travelPreferenceService.updateOrCreateTravelPreference(preferencesId, newPreferences);
        return ResponseEntity.ok(updatedPreferences);
    }



    private Vendors createVendor(Map<String, Object> userDetails, ObjectId userId) {
        Vendors vendor = new Vendors();
        vendor.setBusinessName((String) userDetails.get("businessName"));
        vendor.setBusinessRegistrationNumber((String) userDetails.get("businessRegistrationNumber"));
        vendor.setCountryOfRegistration((String) userDetails.get("countryOfRegistration"));
        vendor.setBusinessAddress((String) userDetails.get("businessAddress"));
        vendor.setBusinessPhoneNumber((String) userDetails.get("businessPhoneNumber"));
        vendor.setBusinessType((String) userDetails.get("businessType"));
        vendor.setIndustry((String) userDetails.get("industry"));
        vendor.setProofOfRegistration((byte[]) userDetails.get("proofOfRegistration"));
        vendor.setVerificationStatus(VerificationStatus.PENDING);
        vendor.setRepresentativeRole((String) userDetails.get("representativeRole"));
        vendor.setRepresentativeId(userId);
        return vendor;
    }

    private List<String> safeGetListFromMap(Map<String, Object> map, String key) {
        return map.containsKey(key) ? (List<String>) map.get(key) : Collections.emptyList();
    }



    /* Helper Functions */

    private Map<String, Object> mapUserToResponse(Users users) {
        Map<String, Object> userMap = new LinkedHashMap<>();
        userMap.put("userId", users.getId().toHexString());
        userMap.put("firstName", users.getFirstName());
        userMap.put("lastName", users.getLastName());
        userMap.put("username", users.getUsername());
        userMap.put("email", users.getEmail());
        userMap.put("password", users.getPassword());
        userMap.put("phoneNumber", users.getPhoneNumber());
        userMap.put("role", users.getRole());
        userMap.put("verificationStatus", users.getVerificationStatus());
        userMap.put("createdAt", users.getCreatedAt());

        if(users.getTravelPreferences() != null) {
            TravelPreferences preferences = users.getTravelPreferences();
            Map<String, Object> preferencesMap = new LinkedHashMap<>();
            preferencesMap.put("preferenceId", preferences.getPreferenceId().toHexString());
            preferencesMap.put("activities", preferences.getActivities());
            preferencesMap.put("food", preferences.getFood());
            preferencesMap.put("weather", preferences.getWeather());
            userMap.put("travelPreferences", preferencesMap);
        } else {
            userMap.put("travelPreferences", null);
        }

        List<String> tripIds = (users.getTrips() != null) ?
                users.getTrips().stream()
                        .map(ObjectId::toHexString)
                        .collect(Collectors.toList()) : Collections.emptyList();
        userMap.put("trips", tripIds);

        return userMap;
    }
}
