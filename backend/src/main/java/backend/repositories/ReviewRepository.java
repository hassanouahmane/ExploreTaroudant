package backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param; // Important pour @Param
import org.springframework.stereotype.Repository;
import java.util.List;
import backend.entities.Review;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    
    // Récupérer les avis d'un utilisateur
    List<Review> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    // Récupérer absolument tous les avis pour l'admin
    List<Review> findAllByOrderByCreatedAtDesc();
    
    // Récupérer les avis par lieu
    List<Review> findByPlaceIdOrderByCreatedAtDesc(Long placeId);
    
    // Moyenne des notes avec Coalesce
    @Query("SELECT COALESCE(AVG(r.rating), 0.0) FROM Review r WHERE r.place.id = :placeId")
    Double findAverageRatingByPlaceId(@Param("placeId") Long placeId);
}