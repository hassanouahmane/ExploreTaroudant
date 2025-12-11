package com.ExploreTaroudant.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name="artisans")
public class Artisan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String speciality;
    private String phone;
    private String city;

    private LocalDateTime createdAt = LocalDateTime.now();

    // Getters and Setters
}
