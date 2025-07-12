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
        String otp = GenerateOTP.getOTP();
        SendOTPService.sendOTP(email, otp);
        otpRepository.save(new OtpRecord(email, otp, LocalDateTime.now()));
    }

    public boolean verifyOtp(String email, String enteredOtp){
        OtpRecord latest = otpRepository.findTopByEmailOrderByGeneratedAtDesc(email);
        if (latest == null) {
            return false; // No OTP found for the email
        }
        if(latest.getGeneratedAt().plusMinutes(5).isBefore(LocalDateTime.now())) {
            return false; // OTP expired
        }
        return latest.getOtp().equals(enteredOtp);
    }
}
