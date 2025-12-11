package com.ExploreTaroudant.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name="reports")
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String reportType;

    @Column(columnDefinition = "TEXT")
    private String description;

    private LocalDateTime createdAt = LocalDateTime.now();

    // Getters and Setters
}
