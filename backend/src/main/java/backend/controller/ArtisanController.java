package backend.controller;

import backend.entities.Artisan;
import backend.entities.User;
import backend.service.ArtisanService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import backend.repositories.ArtisanRepository;

@RestController
@RequestMapping("/api/artisans")
@CrossOrigin(origins = "*")
public class ArtisanController {

    private final ArtisanService artisanService;
    private final ArtisanRepository artisanRepository;

    public ArtisanController(ArtisanService artisanService, ArtisanRepository artisanRepository) {
        this.artisanService = artisanService;
        this.artisanRepository = artisanRepository;
    }

    @GetMapping
    public ResponseEntity<List<Artisan>> getAllActive() {
        return ResponseEntity.ok(artisanService.getAllActiveArtisans());
    }
@GetMapping("/all")
@PreAuthorize("hasAnyRole('ADMIN', 'GUIDE')")
public ResponseEntity<List<Artisan>> getAll(@AuthenticationPrincipal User currentUser) {
    // CORRECTION : Appeler getAllArtisans() pour voir aussi les PENDING
    return ResponseEntity.ok(artisanService.getAllArtisans()); 
}

@GetMapping("/{id}")
public ResponseEntity<Artisan> getById(@PathVariable Long id) {
    return artisanRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
}

    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Artisan>> getPending() {
        return ResponseEntity.ok(artisanService.getPendingArtisans());
    }
@PutMapping("/{id}")
@PreAuthorize("hasAnyRole('ADMIN', 'GUIDE')")
public ResponseEntity<Artisan> update(
        @PathVariable Long id,
        @RequestBody Artisan artisan,
        @AuthenticationPrincipal User currentUser) {
    // Log pour debug
    System.out.println("Modification de l'artisan ID: " + id);
    return ResponseEntity.ok(artisanService.updateArtisan(id, artisan, currentUser));
}
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'GUIDE')")
    public ResponseEntity<Artisan> create(
            @RequestBody Artisan artisan, 
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(artisanService.createArtisan(artisan, currentUser));
    }
@PutMapping("/{id}/validate")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<Artisan> validate(@PathVariable Long id) {
    return ResponseEntity.ok(artisanService.validateArtisan(id));
}

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        artisanService.deleteArtisan(id);
        return ResponseEntity.noContent().build();
    }
}