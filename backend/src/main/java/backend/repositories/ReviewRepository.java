package backend.repositories;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import backend.entities.Review;

@Repository
public interface ReviewRepository extends JpaRepository<backend.entities.Review, Long> {
    List<backend.entities.Review> findByUserIdOrderByCreatedAtDesc(Long userId);
     
    List<Review> findByPlaceIdOrderByCreatedAtDesc(Long placeId);
    
    // Coalesce permet de retourner 0.0 si le résultat du AVG est null
    @Query("SELECT COALESCE(AVG(r.rating), 0.0) FROM Review r WHERE r.place.id = :placeId")
    Double findAverageRatingByPlaceId(Long placeId);

}

