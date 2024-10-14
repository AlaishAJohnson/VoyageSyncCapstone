package com.example.voyagesynccapstone.controllers;
@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/{userID}")
    public ResponseEntity<User> getUserById(@PathVariable Long userID) {
        User user = userService.getUserById(userID);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/assign-permission")
    public ResponseEntity<String> assignPermissionToUser(
            @RequestParam Long userID, @RequestParam Long permissionID) {
        userService.assignPermission(userID, permissionID);
        return ResponseEntity.ok("Permission assigned successfully.");
    }
}
