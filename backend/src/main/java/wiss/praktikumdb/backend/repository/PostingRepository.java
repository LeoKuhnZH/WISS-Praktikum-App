package wiss.praktikumdb.backend.repository;

import wiss.praktikumdb.backend.model.Posting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

public interface PostingRepository extends JpaRepository<Posting, Long> {
}
