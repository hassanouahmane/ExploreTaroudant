package backend.repositories;

import backend.entities.Circuit;
import backend.entities.Guide;
import backend.entities.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CircuitRepository extends JpaRepository<Circuit, Long> {
    List<Circuit> findByStatus(Status status);
    List<Circuit> findByGuideAndStatus(Guide guide, Status status);
    List<Circuit> findByGuide(Guide guide);
    Optional<Circuit> findByIdAndGuide(Long id, Guide guide);
}