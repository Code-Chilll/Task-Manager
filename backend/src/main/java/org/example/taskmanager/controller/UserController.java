package org.example.taskmanager.controller;

import org.example.taskmanager.model.User;
import org.example.taskmanager.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RequestMapping("/users")
@RestController
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.createUser(user);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User loginRequest) {
        Map<String, Object> result = userService.loginUser(loginRequest);
        if (result.get("success").equals(true)) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.badRequest().body(result);
        }
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{email}")
    public User getUserByEmail(@PathVariable String email) {
        return userService.getUserByEmail(email);
    }

    @DeleteMapping("/{email}")
    public void deleteUser(@PathVariable String email) {
        userService.deleteUser(email);
    }
    
    @PutMapping("/{email}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable String email, @RequestBody Map<String, String> request) {
        try {
            String role = request.get("role");
            User updatedUser = userService.updateUserRole(email, role);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
