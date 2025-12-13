package backend.repositories;

import backend.entities.Artisan;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ArtisanRepository extends JpaRepository<Artisan, Long> {

}

