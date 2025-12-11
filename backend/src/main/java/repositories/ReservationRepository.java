package repositories;

import com.ExploreTaroudant.entities.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByUserIdOrderByReservationDateDesc(Long userId);
    List<Reservation> findByUserIdAndStatus(Long userId, Reservation.Status status);
    List<Reservation> findByActivityId(Long activityId);
    List<Reservation> findByCircuitId(Long circuitId);
}