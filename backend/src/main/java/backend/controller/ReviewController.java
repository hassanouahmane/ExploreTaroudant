package backend.controller;


import backend.entities.Review;
import backend.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<Review> createReview(
            @RequestHeader("X-User-Id") Long userId,
            @RequestParam Long placeId,
            @RequestParam int rating,
            @RequestParam String comment) {
        return ResponseEntity.ok(reviewService.createReview(userId, placeId, rating, comment));
    }

    @GetMapping("/place/{placeId}")
    public ResponseEntity<List<Review>> getReviewsByPlace(@PathVariable Long placeId) {
        return ResponseEntity.ok(reviewService.getReviewsByPlace(placeId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Review>> getReviewsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(reviewService.getReviewsByUser(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Review> getReviewById(@PathVariable Long id) {
        return ResponseEntity.ok(reviewService.getReviewById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Review> updateReview(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long id,
            @RequestParam int rating,
            @RequestParam String comment) {
        return ResponseEntity.ok(reviewService.updateReview(userId, id, rating, comment));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long id) {
        reviewService.deleteReview(userId, id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/place/{placeId}/average")
    public ResponseEntity<Double> getAverageRating(@PathVariable Long placeId) {
        return ResponseEntity.ok(reviewService.getAverageRatingForPlace(placeId));
    }
}