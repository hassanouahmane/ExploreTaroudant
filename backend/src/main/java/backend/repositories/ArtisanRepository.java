package backend.repositories;

import backend.entities.Artisan;
import org.springframework.data.jpa.repository.JpaRepository;
import backend.entities.Status;
import java.util.List;

public interface ArtisanRepository extends JpaRepository<Artisan, Long> {
    List<Artisan> findByStatus(Status status);
    List<Artisan> findByCityContainingIgnoreCaseAndStatus(String city, Status status);
}

