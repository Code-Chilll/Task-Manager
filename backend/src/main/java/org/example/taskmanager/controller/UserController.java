package org.example.taskmanager.controller;

import org.example.taskmanager.model.User;
import org.example.taskmanager.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

@RequestMapping("/users")
@RestController
public class UserController {

    @Autowired
    private UserService userService;

    private static final Pattern EMAIL_PATTERN = Pattern.compile(
        "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
    );

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody User user) {
        // Validate user input
        if (user == null) {
            return ResponseEntity.badRequest().body("User data is required");
        }
        
        if (user.getName() == null || user.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Name is required");
        }
        
        if (user.getName().trim().length() < 2 || user.getName().trim().length() > 100) {
            return ResponseEntity.badRequest().body("Name must be between 2 and 100 characters");
        }
        
        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Email is required");
        }
        
        if (!EMAIL_PATTERN.matcher(user.getEmail().trim()).matches()) {
            return ResponseEntity.badRequest().body("Invalid email format");
        }
        
        if (user.getPassword() == null || user.getPassword().isEmpty()) {
            return ResponseEntity.badRequest().body("Password is required");
        }
        
        if (user.getPassword().length() < 6) {
            return ResponseEntity.badRequest().body("Password must be at least 6 characters long");
        }
        
        // Sanitize inputs
        user.setName(user.getName().trim());
        user.setEmail(user.getEmail().trim().toLowerCase());
        
        try {
            User createdUser = userService.createUser(user);
            return ResponseEntity.ok(createdUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to create user: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User loginRequest) {
        // Validate login input
        if (loginRequest == null) {
            return ResponseEntity.badRequest().body("Login data is required");
        }
        
        if (loginRequest.getEmail() == null || loginRequest.getEmail().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Email is required");
        }
        
        if (!EMAIL_PATTERN.matcher(loginRequest.getEmail().trim()).matches()) {
            return ResponseEntity.badRequest().body("Invalid email format");
        }
        
        if (loginRequest.getPassword() == null || loginRequest.getPassword().isEmpty()) {
            return ResponseEntity.badRequest().body("Password is required");
        }
        
        // Sanitize email
        loginRequest.setEmail(loginRequest.getEmail().trim().toLowerCase());
        
        try {
            Map<String, Object> result = userService.loginUser(loginRequest);
            if (result.get("success").equals(true)) {
                return ResponseEntity.ok(result);
            } else {
                return ResponseEntity.badRequest().body(result);
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Login failed: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        try {
            List<User> users = userService.getAllUsers();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{email}")
    public ResponseEntity<?> getUserByEmail(@PathVariable String email) {
        // Validate email parameter
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Email is required");
        }
        
        if (!EMAIL_PATTERN.matcher(email.trim()).matches()) {
            return ResponseEntity.badRequest().body("Invalid email format");
        }
        
        try {
            User user = userService.getUserByEmail(email.trim().toLowerCase());
            if (user != null) {
                return ResponseEntity.ok(user);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to get user: " + e.getMessage());
        }
    }

    @DeleteMapping("/{email}")
    public ResponseEntity<?> deleteUser(@PathVariable String email) {
        // Validate email parameter
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Email is required");
        }
        
        if (!EMAIL_PATTERN.matcher(email.trim()).matches()) {
            return ResponseEntity.badRequest().body("Invalid email format");
        }
        
        try {
            userService.deleteUser(email.trim().toLowerCase());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to delete user: " + e.getMessage());
        }
    }

    @PutMapping("/{email}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable String email, @RequestBody Map<String, String> request) {
        // Validate email parameter
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Email is required");
        }
        
        if (!EMAIL_PATTERN.matcher(email.trim()).matches()) {
            return ResponseEntity.badRequest().body("Invalid email format");
        }
        
        // Validate role
        if (request == null || !request.containsKey("role")) {
            return ResponseEntity.badRequest().body("Role is required");
        }
        
        String role = request.get("role");
        if (role == null || role.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Role cannot be empty");
        }
        
        String normalizedRole = role.trim().toUpperCase();
        if (!normalizedRole.equals("USER") && !normalizedRole.equals("ADMIN")) {
            return ResponseEntity.badRequest().body("Role must be either USER or ADMIN");
        }
        
        try {
            User updatedUser = userService.updateUserRole(email.trim().toLowerCase(), normalizedRole);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to update user role: " + e.getMessage());
        }
    }
}
