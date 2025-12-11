package com.ExploreTaroudant.entities;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name="circuits")
public class Circuit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String duration;

    private BigDecimal price;

    @ManyToOne
    @JoinColumn(name="guide_id")
    private Guide guide;

    // Getters and Setters
}
