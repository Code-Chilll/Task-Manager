package org.example.taskmanager.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String description;
    private boolean completed;
    private String priority;
    private String lastDate;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name="user_email", referencedColumnName ="email")
    private User user;

    public Long getId(){
        return id;
    }
    public void setId(Long id){
        this.id = id;
    }

    public String getName(){
        return name;
    }
    public void setName(String name){
        this.name = name;
    }

    public String getDescription(){
        return description;
    }
    public void setDescription(String description){
        this.description = description;
    }

    public boolean isCompleted(){
        return completed;
    }
    public void setCompleted(boolean completed){
        this.completed = completed;
    }

    public String getPriority() {
        return priority;
    }
    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getLastDate() {
        return lastDate;
    }
    public void setLastDate(String lastDate) {
        this.lastDate = lastDate;
    }

    @PrePersist
    protected void onCreate(){
        this.createdAt = LocalDateTime.now();
    }
    public LocalDateTime getCreatedAt(){
        return createdAt;
    }

    public User getUser(){
        return user;
    }
    public void setUser(User user){
        this.user = user;
    }
}
