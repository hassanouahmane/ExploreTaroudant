package backend.controller;

import backend.entities.Artisan;
import backend.entities.User;
import backend.service.ArtisanService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/artisans")
@CrossOrigin(origins = "*")
public class ArtisanController {

    private final ArtisanService artisanService;

    public ArtisanController(ArtisanService artisanService) {
        this.artisanService = artisanService;
    }

    @GetMapping
    public ResponseEntity<List<Artisan>> getAllActive() {
        return ResponseEntity.ok(artisanService.getAllActiveArtisans());
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Artisan>> getPending() {
        return ResponseEntity.ok(artisanService.getPendingArtisans());
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