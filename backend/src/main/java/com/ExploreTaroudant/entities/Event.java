package com.ExploreTaroudant.entities;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name="events")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private LocalDate startDate;
    private LocalDate endDate;

    private String location;

    // Getters and Setters
}
