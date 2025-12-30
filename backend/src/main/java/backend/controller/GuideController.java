package backend.controller;

import backend.entities.Circuit;
import backend.entities.User;
import backend.service.CircuitService;
import backend.service.GuideService;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/guide")
@CrossOrigin(origins = "*") // Permet la connexion avec le frontend
public class GuideController {

    private final GuideService guideService;
    private final CircuitService circuitService;

    public GuideController(CircuitService circuitService, GuideService guideService) {
        this.circuitService = circuitService;
        this.guideService = guideService;
    }

    // --- GESTION DU PROFIL ---

    @GetMapping("/profile")
    @PreAuthorize("hasRole('GUIDE')")
    public ResponseEntity<User> getGuideProfile(@AuthenticationPrincipal User currentUser) {
        User guide = guideService.getGuideProfile(currentUser.getEmail());
        return ResponseEntity.ok(guide);
    }

    @PutMapping("/profile")
    @PreAuthorize("hasRole('GUIDE')")
    public ResponseEntity<User> updateGuideProfile(
            @AuthenticationPrincipal User currentUser,
            @RequestBody User updatedGuide) {
        User guide = guideService.updateGuideProfile(currentUser.getEmail(), updatedGuide);
        return ResponseEntity.ok(guide);
    }
// backend/controller/GuideController.java

@PutMapping("/profile/technical") // Assurez-vous que c'est bien PUT
@PreAuthorize("hasRole('GUIDE')")
public ResponseEntity<User> updateTechnicalInfo(
        @AuthenticationPrincipal User currentUser,
        @RequestBody Map<String, String> updates) {
    
    // Log pour debugger
    System.out.println("Requête PUT reçue pour le profil technique de: " + currentUser.getEmail());
    
    User user = guideService.updateTechnicalInfo(currentUser.getEmail(), updates);
    return ResponseEntity.ok(user);
}
    // --- GESTION DES CIRCUITS PROPRES AU GUIDE ---

    @PostMapping("/circuits")
    @PreAuthorize("hasRole('GUIDE')")
    public ResponseEntity<Circuit> createCircuit(
            @AuthenticationPrincipal User currentUser,
            @RequestBody Circuit circuit) {
        Circuit createdCircuit = circuitService.createCircuit(circuit, currentUser);
        return new ResponseEntity<>(createdCircuit, HttpStatus.CREATED);
    }

    @GetMapping("/circuits")
    @PreAuthorize("hasRole('GUIDE')")
    public ResponseEntity<List<Circuit>> getAllMyCircuits(@AuthenticationPrincipal User currentUser) {
        List<Circuit> circuits = circuitService.getCircuitsByGuide(currentUser);
        return ResponseEntity.ok(circuits);
    }

    @GetMapping("/circuits/{id}")
    @PreAuthorize("hasRole('GUIDE')")
    public ResponseEntity<Circuit> getMyCircuitById(
            @AuthenticationPrincipal User currentUser,
            @PathVariable Long id) {
        Circuit circuit = circuitService.getCircuitById(id)
                .filter(c -> c.getGuide() != null && c.getGuide().getUser().getId().equals(currentUser.getId()))
                .orElseThrow(() -> new RuntimeException("Circuit non trouvé ou vous n'êtes pas le propriétaire"));
        return ResponseEntity.ok(circuit);
    }

    @PutMapping("/circuits/{id}")
    @PreAuthorize("hasRole('GUIDE')")
    public ResponseEntity<Circuit> updateMyCircuit(
            @AuthenticationPrincipal User currentUser,
            @PathVariable Long id,
            @RequestBody Circuit circuit) {
        Circuit updatedCircuit = circuitService.updateCircuit(id, circuit, currentUser);
        return ResponseEntity.ok(updatedCircuit);
    }

    @DeleteMapping("/circuits/{id}")
    @PreAuthorize("hasRole('GUIDE')")
    public ResponseEntity<Void> deleteMyCircuit(
            @AuthenticationPrincipal User currentUser,
            @PathVariable Long id) {
        circuitService.deleteCircuit(id, currentUser);
        return ResponseEntity.noContent().build();
    }
}