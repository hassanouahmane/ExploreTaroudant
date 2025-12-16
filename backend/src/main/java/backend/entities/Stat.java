package backend.entities;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name="stats")
@Data
public class Stat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String keyName;
    private Integer valueNumber;

    // Getters and Setters
}
