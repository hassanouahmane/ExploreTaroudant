package backend.service;

import backend.entities.*;
import backend.repositories.*;
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

    public Reservation createReservation(Long userId, Reservation reservationRequest) {
        // 1. Récupérer l'utilisateur
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // 2. Créer une nouvelle réservation pour éviter les références détachées
        Reservation reservation = new Reservation();
        reservation.setUser(user);
        reservation.setReservationDate(reservationRequest.getReservationDate());
        reservation.setStatus(Reservation.Status.CONFIRMED);

        // 3. Gérer activité
        if (reservationRequest.getActivity() != null && reservationRequest.getActivity().getId() != null) {
            Activity activity = activityRepository.findById(reservationRequest.getActivity().getId())
                    .orElseThrow(() -> new RuntimeException("Activité non trouvée avec id: " + reservationRequest.getActivity().getId()));
            reservation.setActivity(activity);
        }

        // 4. Gérer circuit
        if (reservationRequest.getCircuit() != null && reservationRequest.getCircuit().getId() != null) {
            Circuit circuit = circuitRepository.findById(reservationRequest.getCircuit().getId())
                    .orElseThrow(() -> new RuntimeException("Circuit non trouvé avec id: " + reservationRequest.getCircuit().getId()));
            reservation.setCircuit(circuit);
        }

        // 5. Validation
        if (reservation.getActivity() == null && reservation.getCircuit() == null) {
            throw new RuntimeException("Une activité ou un circuit doit être spécifié");
        }

        // 6. Validation de la date
        if (reservation.getReservationDate() == null) {
            throw new RuntimeException("La date de réservation est requise");
        }

        if (reservation.getReservationDate().isBefore(LocalDate.now())) {
            throw new RuntimeException("La date de réservation ne peut pas être dans le passé");
        }

        // 7. Sauvegarder
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