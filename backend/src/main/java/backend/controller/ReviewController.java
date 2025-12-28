package backend.controller;


import backend.entities.Review;
import backend.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import backend.entities.User;


@RestController
@RequestMapping("/api/reviews")
//@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReviewController {

    private final ReviewService reviewService;
    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }
   @PostMapping
    public ResponseEntity<Review> createReview(
            @AuthenticationPrincipal User currentUser, // Récupéré du JWT
            @RequestParam Long placeId,
            @RequestParam int rating,
            @RequestParam String comment) {
        return ResponseEntity.ok(reviewService.createReview(currentUser.getId(), placeId, rating, comment));
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
            @AuthenticationPrincipal User currentUser,
            @PathVariable Long id,
            @RequestParam int rating,
            @RequestParam String comment) {
        return ResponseEntity.ok(reviewService.updateReview(currentUser.getId(), id, rating, comment));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(
            @AuthenticationPrincipal User currentUser,
            @PathVariable Long id) {
        reviewService.deleteReview(currentUser.getId(), id);
        return ResponseEntity.noContent().build();
    }
    // Dans backend.controller.ReviewController

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Review>> getAllReviews() {
        return ResponseEntity.ok(reviewService.getAllReviews());
    }
    @GetMapping("/place/{placeId}/average")
    public ResponseEntity<Double> getAverageRating(@PathVariable Long placeId) {
        return ResponseEntity.ok(reviewService.getAverageRatingForPlace(placeId));
    }
}