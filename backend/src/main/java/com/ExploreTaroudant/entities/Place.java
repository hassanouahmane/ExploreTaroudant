package com.ExploreTaroudant.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name="places")
public class Place {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String city;

    private Double latitude;
    private Double longitude;

    private String imageUrl;

    private LocalDateTime createdAt = LocalDateTime.now();

    // Getters and Setters
}
