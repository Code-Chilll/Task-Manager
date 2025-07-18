package org.example.taskmanager.service;

import org.example.taskmanager.model.User;
import org.example.taskmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordService passwordService;

    public User createUser(User user) {
        // Hash password before saving
        user.setPassword(passwordService.hashPassword(user.getPassword()));
        return userRepository.save(user);
    }

    public String loginUser(User loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail());
        if (user != null && passwordService.verifyPassword(loginRequest.getPassword(), user.getPassword())) {
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
            // Hash password before saving
            user.setPassword(passwordService.hashPassword(user.getPassword()));
            userRepository.save(user);
            return 1; // successfully registered
        }
    }
}


