package org.example.taskmanager.controller;

import org.example.taskmanager.model.User;
import org.example.taskmanager.service.OtpService;
import org.example.taskmanager.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.regex.Pattern;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private OtpService otpService;

    @Autowired
    private UserService userService;

    private static final Pattern EMAIL_PATTERN = Pattern.compile(
        "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
    );

    @PostMapping("/send-otp")
    public ResponseEntity<String> sendOtp(@RequestParam String email){
        // Validate email format
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Email is required");
        }
        
        if (!EMAIL_PATTERN.matcher(email.trim()).matches()) {
            return ResponseEntity.badRequest().body("Invalid email format");
        }
        
        try {
            otpService.generateAndSendOtp(email.trim());
            return ResponseEntity.ok("OTP sent successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to send OTP: " + e.getMessage());
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestParam String email, @RequestParam String otp) {
        // Validate inputs
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Email is required");
        }
        
        if (otp == null || otp.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("OTP is required");
        }
        
        if (!EMAIL_PATTERN.matcher(email.trim()).matches()) {
            return ResponseEntity.badRequest().body("Invalid email format");
        }
        
        if (otp.trim().length() != 4) {
            return ResponseEntity.badRequest().body("OTP must be 4 digits");
        }
        
        try {
            if(otpService.verifyOtp(email.trim(), otp.trim())){
                return ResponseEntity.ok("OTP verified successfully");
            } else {
                return ResponseEntity.badRequest().body("Invalid or expired OTP");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("OTP verification failed: " + e.getMessage());
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody User user, @RequestParam String otp) {
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
        
        if (otp == null || otp.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("OTP is required");
        }
        
        if (otp.trim().length() != 4) {
            return ResponseEntity.badRequest().body("OTP must be 4 digits");
        }
        
        // Sanitize inputs
        user.setName(user.getName().trim());
        user.setEmail(user.getEmail().trim().toLowerCase());
        
        try {
            if(otpService.verifyOtp(user.getEmail(), otp.trim())){
                Integer result = userService.saveUser(user);
                if(result == 0){
                    return ResponseEntity.badRequest().body("User already exists");
                } else if(result != null) {
                    return ResponseEntity.ok("User registered successfully");
                } else {
                    return ResponseEntity.badRequest().body("Error occurred while registering user");
                }
            } else {
                return ResponseEntity.badRequest().body("Invalid or expired OTP");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Signup failed: " + e.getMessage());
        }
    }
}
