package org.example.taskmanager.controller;

import org.example.taskmanager.model.User;
import org.example.taskmanager.service.OtpService;
import org.example.taskmanager.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private OtpService otpService;

    @Autowired
    private UserService userService;

    @PostMapping("/send-otp")
    public ResponseEntity<String> sendOtp(@RequestParam String email){
        otpService.generateAndSendOtp(email);
        return ResponseEntity.ok("OTP sent successfully");
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestParam String email, @RequestParam String otp) {
        if(otpService.verifyOtp(email, otp)){
            return ResponseEntity.ok("OTP verified successfully");
        } else {
            throw new SecurityException("Invalid or expired OTP");
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody User user, @RequestParam String otp) {
        if(!otpService.verifyOtp(user.getEmail(), otp)){
            throw new SecurityException("Invalid or expired OTP");
        }
        
        Integer result = userService.saveUser(user);
        if(result == 0){
            throw new IllegalArgumentException("User already exists");
        } else if(result != null) {
            return ResponseEntity.ok("User registered successfully");
        } else {
            throw new IllegalArgumentException("Error occurred while registering user");
        }
    }
}
