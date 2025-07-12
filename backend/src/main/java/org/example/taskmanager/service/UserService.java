package org.example.taskmanager.service;

import org.example.taskmanager.model.User;
import org.example.taskmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // Save user if not already exists
    public Integer saveUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            return 0; // already registered
        } else {
            userRepository.save(user);
            return 1; // successfully registered
        }
    }

    public boolean isUserExists(String email) {
        return userRepository.existsByEmail(email);
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}


