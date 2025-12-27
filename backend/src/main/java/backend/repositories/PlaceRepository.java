package backend.repositories;

import backend.entities.Status;

import backend.entities.Place;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PlaceRepository extends JpaRepository<Place, Long> {
    List<Place> findByNameContainingIgnoreCase(String name);
    List<Place> findByCityContainingIgnoreCase(String city);

    List<Place> findByStatus(Status status);

    List<Place> findByStatusOrderByCreatedAtDesc(Status status);
}
