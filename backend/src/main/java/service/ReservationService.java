package service ;
import com.ExploreTaroudant.entities.Reservation;
import com.ExploreTaroudant.entities.Activity;
import com.ExploreTaroudant.entities.Circuit;
import com.ExploreTaroudant.entities.User;
import repositories.ReservationRepository;
import repositories.ActivityRepository;
import repositories.CircuitRepository;
import repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final ActivityRepository activityRepository;
    private final CircuitRepository circuitRepository;
    private final UserRepository userRepository;
    public Reservation createReservation(Long userId, Reservation reservation) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // Vérifier que l'activité existe si spécifiée
        if (reservation.getActivity() != null) {
            activityRepository.findById(reservation.getActivity().getId())
                    .orElseThrow(() -> new RuntimeException("Activité non trouvée"));
        }

        // Vérifier que le circuit existe si spécifié
        if (reservation.getCircuit() != null) {
            circuitRepository.findById(reservation.getCircuit().getId())
                    .orElseThrow(() -> new RuntimeException("Circuit non trouvé"));
        }

        // S'assurer qu'au moins une activité ou un circuit est spécifié
        if (reservation.getActivity() == null && reservation.getCircuit() == null) {
            throw new RuntimeException("Une activité ou un circuit doit être spécifié");
        }

        reservation.setUser(user);
        if (reservation.getStatus() == null) {
            reservation.setStatus(Reservation.Status.CONFIRMED);
        }

        return reservationRepository.save(reservation);
    }


    public Reservation createCircuitReservation(Long userId, Long circuitId, LocalDate reservationDate) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        Circuit circuit = circuitRepository.findById(circuitId)
                .orElseThrow(() -> new RuntimeException("Circuit non trouvé"));

        Reservation reservation = new Reservation();
        reservation.setUser(user);
        reservation.setCircuit(circuit);
        reservation.setReservationDate(reservationDate);
        reservation.setStatus(Reservation.Status.CONFIRMED);

        return reservationRepository.save(reservation);
    }

    public List<Reservation> getMyReservations(Long userId) {
        return reservationRepository.findByUserIdOrderByReservationDateDesc(userId);
    }

    public Reservation getReservationById(Long reservationId) {
        return reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Réservation non trouvée"));
    }

    public List<Reservation> getReservationsByStatus(Long userId, Reservation.Status status) {
        return reservationRepository.findByUserIdAndStatus(userId, status);
    }

    public void cancelReservation(Long userId, Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Réservation non trouvée"));

        if (!reservation.getUser().getId().equals(userId)) {
            throw new RuntimeException("Vous ne pouvez annuler que vos propres réservations");
        }

        if (reservation.getStatus() == Reservation.Status.CANCELLED) {
            throw new RuntimeException("Cette réservation est déjà annulée");
        }

        reservation.setStatus(Reservation.Status.CANCELLED);
        reservationRepository.save(reservation);
    }

    public Reservation updateReservationStatus(Long reservationId, Reservation.Status newStatus) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Réservation non trouvée"));

        reservation.setStatus(newStatus);
        return reservationRepository.save(reservation);
    }

    public void deleteReservation(Long userId, Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Réservation non trouvée"));

        if (!reservation.getUser().getId().equals(userId)) {
            throw new RuntimeException("Vous ne pouvez supprimer que vos propres réservations");
        }

        reservationRepository.delete(reservation);
    }

    public List<Reservation> getReservationsByActivity(Long activityId) {
        return reservationRepository.findByActivityId(activityId);
    }

    public List<Reservation> getReservationsByCircuit(Long circuitId) {
        return reservationRepository.findByCircuitId(circuitId);
    }


}
