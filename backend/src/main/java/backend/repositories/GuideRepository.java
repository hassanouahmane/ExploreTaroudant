package backend.repositories;

import backend.entities.Guide;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GuideRepository extends JpaRepository<Guide,Integer> {

}
