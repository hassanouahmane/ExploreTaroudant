package backend.repositories;

import backend.entities.Stat;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StatRepository extends JpaRepository<Stat, Long> {}

