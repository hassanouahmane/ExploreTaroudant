package backend.repositories;
import backend.entities.Event;
import backend.entities.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findAllByOrderByStartDateDesc();
    List<Event> findByEndDateAfterOrderByStartDateAsc(LocalDate date);
    List<Event> findByStatusAndEndDateAfterOrderByStartDateAsc(Status status, LocalDate date);
    List<Event> findByProposedByOrderByStartDateDesc(backend.entities.User user);
    // Admin : Tous par statut
    List<Event> findByStatus(Status status);
    
}
