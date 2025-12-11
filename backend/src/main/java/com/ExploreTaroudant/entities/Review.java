package com.ExploreTaroudant.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name="reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name="user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name="place_id")
    private Place place;

    private int rating;

    @Column(columnDefinition = "TEXT")
    private String comment;

    private LocalDateTime createdAt = LocalDateTime.now();

    // Getters and Setters
}
