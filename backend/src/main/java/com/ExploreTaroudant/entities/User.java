package com.ExploreTaroudant.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name="users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false)
    private String fullName;

    @Column(nullable=false, unique=true)
    private String email;

    @Column(nullable=false)
    private String password;

    private String phone;

    @Enumerated(EnumType.STRING)
    private Role role = Role.TOURIST;

    @Enumerated(EnumType.STRING)
    private Status status = Status.ACTIVE;

    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Role { TOURIST, GUIDE, ADMIN }
    public enum Status { ACTIVE, SUSPENDED }

    // Getters and Setters
}