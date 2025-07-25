package org.example.taskmanager.service;

import org.example.taskmanager.model.OtpRecord;
import org.example.taskmanager.repository.OtpRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class OtpService {

    @Autowired
    private OtpRepository otpRepository;

    public void generateAndSendOtp(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }
        
        String otp = GenerateOTP.getOTP();
        SendOTPService.sendOTP(email.trim(), otp);
        otpRepository.save(new OtpRecord(email.trim().toLowerCase(), otp, LocalDateTime.now()));
    }

    public boolean verifyOtp(String email, String enteredOtp){
        if (email == null || email.trim().isEmpty()) {
            return false;
        }
        
        if (enteredOtp == null || enteredOtp.trim().isEmpty()) {
            return false;
        }
        
        // Validate OTP format (should be 4 digits)
        if (enteredOtp.trim().length() != 4 || !enteredOtp.trim().matches("\\d{4}")) {
            return false;
        }
        
        OtpRecord latest = otpRepository.findTopByEmailOrderByGeneratedAtDesc(email.trim().toLowerCase());
        if (latest == null) {
            return false; // No OTP found for the email
        }
        if(latest.getGeneratedAt().plusMinutes(5).isBefore(LocalDateTime.now())) {
            return false; // OTP expired
        }
        return latest.getOtp().equals(enteredOtp.trim());
    }
}
