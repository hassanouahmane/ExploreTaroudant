package backend.controller;

import backend.entities.Reservation;
import backend.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import backend.entities.User;

@RestController
@RequestMapping("/api/tourist/reservations")
//@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReservationController {

    private final ReservationService reservationService;
    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }
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
}