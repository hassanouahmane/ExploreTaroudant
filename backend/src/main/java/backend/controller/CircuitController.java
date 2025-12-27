package backend.controller;

import backend.entities.Circuit;
import backend.entities.User;
import backend.service.CircuitService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/circuits")
@CrossOrigin(origins = "*")
public class CircuitController {

    private final CircuitService circuitService;

    public CircuitController(CircuitService circuitService) {
        this.circuitService = circuitService;
    }

    // --- ACCÈS PUBLIC ---

    @GetMapping
    public ResponseEntity<List<Circuit>> getAllActive() {
        return ResponseEntity.ok(circuitService.getActiveCircuits());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Circuit> getById(@PathVariable Long id) {
        return circuitService.getCircuitById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // --- ACCÈS ADMIN (Modération) ---

    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Circuit>> getPending() {
        return ResponseEntity.ok(circuitService.getPendingCircuits());
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Circuit>> getAllForAdmin() {
        return ResponseEntity.ok(circuitService.getAllCircuits());
    }

    @PutMapping("/{id}/validate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Circuit> validate(@PathVariable Long id) {
        return ResponseEntity.ok(circuitService.validateCircuit(id));
    }

    // --- ACCÈS GUIDE & ADMIN (Gestion) ---

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'GUIDE')")
    public ResponseEntity<Circuit> create(
            @RequestBody Circuit circuit, 
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(circuitService.createCircuit(circuit, currentUser));
    }

    @GetMapping("/my-circuits")
    @PreAuthorize("hasRole('GUIDE')")
    public ResponseEntity<List<Circuit>> getMyCircuits(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(circuitService.getCircuitsByGuide(currentUser));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'GUIDE')")
    public ResponseEntity<Circuit> update(
            @PathVariable Long id,
            @RequestBody Circuit circuit,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(circuitService.updateCircuit(id, circuit, currentUser));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'GUIDE')")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {
        circuitService.deleteCircuit(id, currentUser);
        return ResponseEntity.noContent().build();
    }
}