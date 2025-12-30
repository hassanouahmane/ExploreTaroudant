package backend.repositories;

import java.util.Optional;

import backend.entities.Guide;

import org.springframework.data.jpa.repository.JpaRepository;

import backend.entities.User;

public interface GuideRepository extends JpaRepository<Guide,Long> {

Optional<Guide> findByUser(User user);
Optional<Guide> findByUserId(Long userId);
}
