package backend.repositories;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<backend.entities.Review, Long> {
    List<backend.entities.Review> findByPlaceIdOrderByCreatedAtDesc(Long placeId);
    List<backend.entities.Review> findByUserIdOrderByCreatedAtDesc(Long userId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.place.id = :placeId")
    Double findAverageRatingByPlaceId(Long placeId);
}

