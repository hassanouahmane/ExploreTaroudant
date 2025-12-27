package backend.repositories;


import backend.entities.Activity;
import backend.entities.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {
    List<Activity> findByPlaceId(Long placeId);
    List<Activity> findByGuideId(Long guideId);
    List<Activity> findByStatus(Status status);
    List<Activity> findByPlaceIdAndStatus(Long placeId, Status status);
}
