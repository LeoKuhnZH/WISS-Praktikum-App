package wiss.praktikumdb.backend.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import wiss.praktikumdb.backend.model.AppUser;
import wiss.praktikumdb.backend.model.Role;
import wiss.praktikumdb.backend.repository.AppUserRepository;

import java.util.Optional;

@Service
@Transactional
public class AppUserService {

    // Dependencies via Constructor Injection (Best Practice!)
    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Instantiates a new App user service.
     *
     * @param userRepository  the user repository
     * @param passwordEncoder the password encoder
     */
    public AppUserService(AppUserRepository userRepository,
                          PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Register user app user.
     *
     * @param username    the username
     * @param email       the email
     * @param rawPassword the raw password
     * @param role        the role
     * @return the app user
     */
    public AppUser registerUser(String username, String email,
                                String rawPassword, Role role) {

        // Validierung: Username bereits vergeben?
        if (userRepository.existsByUsername(username)) {
            throw new IllegalArgumentException(
                    "Username '" + username + "' ist bereits vergeben"
            );
        }

        // Validierung: E-Mail bereits registriert?
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException(
                    "Email '" + email + "' ist bereits registriert"
            );
        }

        // Passwort hashen (NIE raw password speichern!)
        String hashedPassword = passwordEncoder.encode(rawPassword);

        // User Entity erstellen
        AppUser newUser = new AppUser(username, email, hashedPassword, role);

        // Speichern und zurückgeben
        // save() gibt den gespeicherten User MIT ID zurück
        return userRepository.save(newUser);
    }

    /**
     * Find by username optional.
     *
     * @param username the username
     * @return the optional
     */
    public Optional<AppUser> findByUsername(String username) {  
        return userRepository.findByUsername(username);
    }

    /**
     * Find by username or email optional.
     *
     * @param usernameOrEmail the username or email
     * @return the optional
     */
    public Optional<AppUser> findByUsernameOrEmail(String usernameOrEmail) {
        return userRepository.findByUsernameOrEmail(usernameOrEmail, usernameOrEmail);
    }

    /**
     * Authenticate user optional.
     *
     * @param user        the user
     * @param rawPassword the raw password
     * @return the optional
     */
    public Optional<AppUser> authenticateUser(AppUser user, String rawPassword) {
        // Passwort prüfen (BCrypt macht das intern mit Salt)
        if (passwordEncoder.matches(rawPassword, user.getPassword())) {
            return Optional.of(user);  // Login erfolgreich
        }

        return Optional.empty();  // Login fehlgeschlagen       
    }

    /**
     * Find by email optional.
     *
     * @param email the email
     * @return the optional
     */
    public Optional<AppUser> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}