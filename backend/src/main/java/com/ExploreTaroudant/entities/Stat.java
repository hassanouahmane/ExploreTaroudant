package com.ExploreTaroudant.entities;

import jakarta.persistence.*;

@Entity
@Table(name="stats")
public class Stat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String keyName;
    private Integer valueNumber;

    // Getters and Setters
}
