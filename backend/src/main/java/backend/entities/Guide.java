package backend.entities;

import backend.entities.User;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name="guides")
@Data
public class Guide {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name="user_id")
    private User user;

    @Column(columnDefinition = "TEXT")
    private String bio;

    private String languages;

    // Getters and Setters
}
