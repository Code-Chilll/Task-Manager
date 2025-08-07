package org.example.taskmanager.service;

import org.example.taskmanager.model.User;
import org.example.taskmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.NoSuchElementException;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordService passwordService;

    public User createUser(User user) {
        if (user == null) {
            throw new IllegalArgumentException("User data is required");
        }
        
        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }
        
        if (user.getPassword() == null || user.getPassword().isEmpty()) {
            throw new IllegalArgumentException("Password is required");
        }
        
        // Hash password before saving
        user.setPassword(passwordService.hashPassword(user.getPassword()));
        return userRepository.save(user);
    }

    public Map<String, Object> loginUser(User loginRequest) {
        Map<String, Object> response = new HashMap<>();
        
        if (loginRequest == null) {
            response.put("success", false);
            response.put("message", "Login data is required");
            return response;
        }
        
        if (loginRequest.getEmail() == null || loginRequest.getEmail().trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "Email is required");
            return response;
        }
        
        if (loginRequest.getPassword() == null || loginRequest.getPassword().isEmpty()) {
            response.put("success", false);
            response.put("message", "Password is required");
            return response;
        }
        
        User user = userRepository.findByEmail(loginRequest.getEmail().trim().toLowerCase());
        
        if (user != null && passwordService.verifyPassword(loginRequest.getPassword(), user.getPassword())) {
            response.put("success", true);
            response.put("message", "Login successful");
            response.put("email", user.getEmail());
            response.put("name", user.getName());
            response.put("role", user.getRole().toString());
        } else {
            response.put("success", false);
            response.put("message", "Invalid credentials");
        }
        
        return response;
    }

    public java.util.List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserByEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            return null;
        }
        return userRepository.findByEmail(email.trim().toLowerCase());
    }

    public void deleteUser(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }
        
        User user = userRepository.findByEmail(email.trim().toLowerCase());
        if(user != null) {
            userRepository.delete(user);
        }
    }

    // Save user if not already exists (used for OTP signup)
    public Integer saveUser(User user) {
        if (user == null) {
            throw new IllegalArgumentException("User data is required");
        }
        
        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }
        
        if (userRepository.existsByEmail(user.getEmail().toLowerCase())) {
            return 0; // already registered
        } else {
            // Hash password before saving
            user.setPassword(passwordService.hashPassword(user.getPassword()));
            userRepository.save(user);
            return 1; // successfully registered
        }
    }
    
    public User updateUserRole(String email, String roleString) {
        if (email == null || email.trim().isEmpty()) {
            throw new RuntimeException("Email is required");
        }
        
        if (roleString == null || roleString.trim().isEmpty()) {
            throw new RuntimeException("Role is required");
        }
        
        User user = userRepository.findByEmail(email.trim().toLowerCase());
        if (user == null) {
            throw new NoSuchElementException("User not found");
        }
        
        try {
            User.Role role = User.Role.valueOf(roleString.toUpperCase());
            user.setRole(role);
            return userRepository.save(user);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid role: " + roleString);
        }
    }

    public void updatePassword(String email, String newPassword) {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }

        if (newPassword == null || newPassword.isEmpty()) {
            throw new IllegalArgumentException("New password is required");
        }

        User user = userRepository.findByEmail(email.trim().toLowerCase());
        if (user == null) {
            throw new NoSuchElementException("User not found");
        }

        // Hash the new password before saving
        user.setPassword(passwordService.hashPassword(newPassword));
        userRepository.save(user);
    }
}


