package com.ExploreTaroudant.entities;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name="reservations")
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name="user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name="activity_id")
    private Activity activity;

    @ManyToOne
    @JoinColumn(name="circuit_id")
    private Circuit circuit;

    private LocalDate reservationDate;

    @Enumerated(EnumType.STRING)
    private Status status = Status.CONFIRMED;

    public enum Status { PENDING, CONFIRMED, CANCELLED }

    // Getters and Setters
}
