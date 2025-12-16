package backend.controller;

import backend.entities.Reservation;
import backend.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tourist/reservations")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReservationController {

    private final ReservationService reservationService;

    @PostMapping
    public ResponseEntity<Reservation> createReservation(
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody Reservation reservation) {
        return ResponseEntity.ok(reservationService.createReservation(userId, reservation));
    }

    @GetMapping("/my")
    public ResponseEntity<List<Reservation>> getMyReservations(
            @RequestHeader("X-User-Id") Long userId) {
        return ResponseEntity.ok(reservationService.getMyReservations(userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelReservation(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long id) {
        reservationService.cancelReservation(userId, id);
        return ResponseEntity.noContent().build();
    }
}