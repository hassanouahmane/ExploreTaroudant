package backend.controller;

import backend.entities.Place;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import backend.entities.User;
import backend.service.PlaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/places")
//@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PlaceController {

    private final PlaceService placeService;
    public PlaceController(PlaceService placeService) {
        this.placeService = placeService;
    }
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Place>> getAllPlacesForAdmin() {
        return ResponseEntity.ok(placeService.getAllPlaces());
    }

    @GetMapping
    public ResponseEntity<List<Place>> getAllActivePlaces() {
        return ResponseEntity.ok(placeService.getAllActivePlaces());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Place> getPlaceById(@PathVariable Long id) {
        return ResponseEntity.ok(placeService.getPlaceById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Place>> searchPlaces(@RequestParam String query) {
        return ResponseEntity.ok(placeService.searchPlaces(query));
    }

    @GetMapping("/city/{city}")
    public ResponseEntity<List<Place>> getPlacesByCity(@PathVariable String city) {
        return ResponseEntity.ok(placeService.getPlacesByCity(city));
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Place>> getPendingPlaces() {
        return ResponseEntity.ok(placeService.getPendingPlaces());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'GUIDE')")
    public ResponseEntity<Place> createPlace(
            @RequestBody Place place, 
            @AuthenticationPrincipal User userDetails) {
        
        // On passe le username (email) au service pour qu'il gère la logique
        return ResponseEntity.ok(placeService.createPlace(place, userDetails));
    }
    @PutMapping("/{id}/validate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Place> validatePlace(@PathVariable Long id) {
        return ResponseEntity.ok(placeService.validatePlace(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Place> updatePlace(
            @PathVariable Long id,
            @RequestBody Place place) {
        return ResponseEntity.ok(placeService.updatePlace(id, place));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletePlace(@PathVariable Long id) {
        placeService.deletePlace(id);
        return ResponseEntity.noContent().build();
    }
}