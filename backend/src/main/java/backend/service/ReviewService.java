package backend.service;
import backend.entities.Place;
import backend.entities.Review;
import backend.entities.User;
import backend.repositories.PlaceRepository;
import backend.repositories.ReviewRepository;
import backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;


    @Service
    @RequiredArgsConstructor
    @Transactional
    public class ReviewService {

        private final ReviewRepository reviewRepository;
        private final UserRepository userRepository;
        private final PlaceRepository placeRepository;

        public Review createReview(Long userId, Long placeId, int rating, String comment) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

            Place place = placeRepository.findById(placeId)
                    .orElseThrow(() -> new RuntimeException("Lieu non trouvé"));

            if (rating < 1 || rating > 5) {
                throw new RuntimeException("La note doit être entre 1 et 5");
            }

            Review review = new Review();
            review.setUser(user);
            review.setPlace(place);
            review.setRating(rating);
            review.setComment(comment);

            return reviewRepository.save(review);
        }

        @Transactional(readOnly = true)
        public List<Review> getReviewsByPlace(Long placeId) {
            return reviewRepository.findByPlaceIdOrderByCreatedAtDesc(placeId);
        }

        @Transactional(readOnly = true)
        public List<Review> getReviewsByUser(Long userId) {
            return reviewRepository.findByUserIdOrderByCreatedAtDesc(userId);
        }

        @Transactional(readOnly = true)
        public Review getReviewById(Long id) {
            return reviewRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Avis non trouvé"));
        }

        public Review updateReview(Long userId, Long reviewId, int rating, String comment) {
            Review review = getReviewById(reviewId);

            if (!review.getUser().getId().equals(userId)) {
                throw new RuntimeException("Vous ne pouvez modifier que vos propres avis");
            }

            if (rating < 1 || rating > 5) {
                throw new RuntimeException("La note doit être entre 1 et 5");
            }

            review.setRating(rating);
            review.setComment(comment);

            return reviewRepository.save(review);
        }

        public void deleteReview(Long userId, Long reviewId) {
            Review review = getReviewById(reviewId);

            if (!review.getUser().getId().equals(userId)) {
                throw new RuntimeException("Vous ne pouvez supprimer que vos propres avis");
            }

            reviewRepository.delete(review);
        }

        @Transactional(readOnly = true)
        public Double getAverageRatingForPlace(Long placeId) {
            return reviewRepository.findAverageRatingByPlaceId(placeId);
        }
    }


