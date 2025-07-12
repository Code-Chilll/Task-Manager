package org.example.taskmanager.controller;

import org.example.taskmanager.model.User;
import org.example.taskmanager.service.OtpService;
import org.example.taskmanager.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private OtpService otpService;

    @Autowired
    private UserService userService;

    @PostMapping("/send-otp")
    public String sendOtp(@RequestParam String email){
        otpService.generateAndSendOtp(email);
        return "OTP sent successfully";
    }

    @PostMapping("/verify-otp")
    public String verifyOtp(@RequestParam String email, @RequestParam String otp) {
        if(otpService.verifyOtp(email, otp)){
            return "OTP verified successfully";
        }
        else{
            return "Invalid or expired OTP";
        }
    }

    @PostMapping("/signup")
    public String signup(@RequestBody User user,@RequestParam String otp) {
        if(otpService.verifyOtp(user.getEmail(), otp)){
            Integer result = userService.saveUser(user);
            if(result == 0){
                return "User already exists";
            } else if(result != null) {
                return "User registered successfully";
            } else {
                return "Error occurred while registering user";
            }
        } else {
            return "Invalid or expired OTP";
        }
    }
}
