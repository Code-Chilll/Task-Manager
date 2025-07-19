package org.example.taskmanager.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "\"user\"")
public class User {

    @Column(nullable = false)
    private String name;

    @Id
    @Column(unique = true, nullable = false)
    private String email;

    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.USER;

    @JsonManagedReference
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Task> tasks;

    public enum Role {
        USER, ADMIN
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }

    public Role getRole() {
        return role;
    }
    public void setRole(Role role) {
        this.role = role;
    }

    public List<Task> getTasks() {
        return tasks;
    }
    public void setTasks(List<Task> tasks) {
        this.tasks = tasks;
    }
}
