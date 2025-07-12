package org.example.taskmanager.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.time.LocalDateTime;

@Entity
public class OtpRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;
    private String otp;
    private LocalDateTime generatedAt;

    public OtpRecord() {}

    public OtpRecord(String email, String otp, LocalDateTime generatedAt) {
        this.email = email;
        this.otp = otp;
        this.generatedAt = generatedAt;
    }

    public LocalDateTime getGeneratedAt() {
        return generatedAt;
    }

    public Object getOtp() {
        return otp;
    }
}
