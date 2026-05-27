package wiss.praktikumdb.backend.repository;

import wiss.praktikumdb.backend.model.Posting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PostingRepository extends JpaRepository<Posting, Long> {

    List<Posting> findByCompany(String company);

    List<Posting> findByStatus(String status);

    List<Posting> findByTitleContainingIgnoreCase(String keyword);

    List<Posting> findByExpirationDateAfter(LocalDate date);
}

