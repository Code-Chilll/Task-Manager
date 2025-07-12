package org.example.taskmanager.repository;

import org.example.taskmanager.model.OtpRecord;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OtpRepository extends JpaRepository<OtpRecord, Long> {
    public OtpRecord findTopByEmailOrderByGeneratedAtDesc(String email);
}
