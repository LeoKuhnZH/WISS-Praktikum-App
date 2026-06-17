package wiss.praktikumdb.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import wiss.praktikumdb.backend.model.AppUser;

import java.util.Optional;

@Repository
public interface AppUserRepository extends JpaRepository<AppUser, Long> {

    /**
     * Find by username optional.
     *
     * @param username the username
     * @return the optional
     */
// Custom Query Methods für User Management
    Optional<AppUser> findByUsername(String username);

    /**
     * Find by email optional.
     *
     * @param email the email
     * @return the optional
     */
    Optional<AppUser> findByEmail(String email);

    /**
     * Find by email and password optional.
     *
     * @param email    the email
     * @param password the password
     * @return the optional
     */
// Für Login-Validierung
    Optional<AppUser> findByEmailAndPassword(
            String email, String password);

    /**
     * Exists by username boolean.
     *
     * @param username the username
     * @return the boolean
     */
// Prüfung ob Username bereits existiert
    boolean existsByUsername(String username);

    /**
     * Exists by email boolean.
     *
     * @param email the email
     * @return the boolean
     */
    boolean existsByEmail(String email);
}