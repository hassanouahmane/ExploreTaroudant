package backend.controller;

import backend.entities.Reservation;
import backend.service.ReservationService;
import backend.entities.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tourist/reservations")
@CrossOrigin(origins = "*")
public class ReservationController {

    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    // --- PARTIE TOURISTE ---

    @PostMapping
    public ResponseEntity<Reservation> createReservation(
            @AuthenticationPrincipal User currentUser, 
            @RequestBody Reservation reservation) {
        return ResponseEntity.ok(reservationService.createReservation(currentUser.getId(), reservation));
    }

    @GetMapping("/my")
    public ResponseEntity<List<Reservation>> getMyReservations(
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(reservationService.getMyReservations(currentUser.getId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelReservation(
            @AuthenticationPrincipal User currentUser,
            @PathVariable Long id) {
        reservationService.cancelReservation(currentUser.getId(), id);
        return ResponseEntity.noContent().build();
    }

    // --- PARTIE ADMIN ---

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Reservation>> getAllReservationsForAdmin() {
        return ResponseEntity.ok(reservationService.getAllReservations());
    }

    // UNE SEULE MÉTHODE ICI POUR ÉVITER L'ERREUR "AMBIGUOUS MAPPING"
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Reservation> updateReservationStatus(
            @PathVariable Long id,
            @RequestParam Reservation.Status status) {
        return ResponseEntity.ok(reservationService.updateReservationStatus(id, status));
    }
}