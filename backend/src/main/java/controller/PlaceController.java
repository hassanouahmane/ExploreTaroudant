package controller;

import com.ExploreTaroudant.entities.Place;
import service.PlaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/places")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PlaceController {

    private final PlaceService placeService;

    @GetMapping
    public ResponseEntity<List<Place>> getAllPlaces() {
        return ResponseEntity.ok(placeService.getAllPlaces());
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

    @PostMapping
    public ResponseEntity<Place> createPlace(@RequestBody Place place) {
        return ResponseEntity.ok(placeService.createPlace(place));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Place> updatePlace(
            @PathVariable Long id,
            @RequestBody Place place) {
        return ResponseEntity.ok(placeService.updatePlace(id, place));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlace(@PathVariable Long id) {
        placeService.deletePlace(id);
        return ResponseEntity.noContent().build();
    }
}