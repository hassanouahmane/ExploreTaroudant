package com.ExploreTaroudant.entities;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name="activities")
public class Activity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name="place_id")
    private Place place;

    @ManyToOne
    @JoinColumn(name="guide_id")
    private Guide guide;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private BigDecimal price;

    private String duration;

    // Getters and Setters
}
