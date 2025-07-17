package org.example.taskmanager.service;

import org.example.taskmanager.model.User;
import org.example.taskmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public String loginUser(User loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail());
        if (user != null && user.getPassword().equals(loginRequest.getPassword())) {
            return "Login successful";
        }
        return "Invalid credentials";
    }

    public java.util.List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public void deleteUser(String email) {
        User user = userRepository.findByEmail(email);
        if(user != null) {
            userRepository.delete(user);
        }
    }

    // Save user if not already exists (used for OTP signup)
    public Integer saveUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            return 0; // already registered
        } else {
            userRepository.save(user);
            return 1; // successfully registered
        }
    }
}


