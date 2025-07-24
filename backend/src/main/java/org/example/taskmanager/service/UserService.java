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
        // Hash password before saving
        user.setPassword(passwordService.hashPassword(user.getPassword()));
        return userRepository.save(user);
    }

    public Map<String, Object> loginUser(User loginRequest) {
        Map<String, Object> response = new HashMap<>();
        User user = userRepository.findByEmail(loginRequest.getEmail());
        
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
    
    public User updateUserRole(String email, String roleString) {
        User user = userRepository.findByEmail(email);
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
}


