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

    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;

    public AppUserService(AppUserRepository appUserRepository, PasswordEncoder passwordEncoder) {
        this.appUserRepository = appUserRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public AppUser registerUser(String username, String email, String rawPassword) {
        String normalizedUsername = normalizeUsername(username);
        String normalizedEmail = normalizeEmail(email);

        if (appUserRepository.existsByUsernameIgnoreCase(normalizedUsername)) {
            throw new IllegalArgumentException("Username ist bereits vergeben");
        }

        if (appUserRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new IllegalArgumentException("E-Mail ist bereits registriert");
        }

        AppUser user = new AppUser();
        user.setUsername(normalizedUsername);
        user.setEmail(normalizedEmail);
        user.setPassword(passwordEncoder.encode(rawPassword));
        user.setRole(Role.USER);

        return appUserRepository.save(user);
    }

    @Transactional(readOnly = true)
    public Optional<AppUser> findByLogin(String usernameOrEmail) {
        if (usernameOrEmail == null || usernameOrEmail.isBlank()) {
            return Optional.empty();
        }

        String login = usernameOrEmail.trim();
        if (login.contains("@")) {
            return appUserRepository.findByEmailIgnoreCase(login.toLowerCase());
        }

        return appUserRepository.findByUsernameIgnoreCase(login);
    }

    @Transactional(readOnly = true)
    public Optional<AppUser> authenticate(String usernameOrEmail, String rawPassword) {
        if (rawPassword == null) {
            return Optional.empty();
        }

        return findByLogin(usernameOrEmail)
                .filter(user -> passwordEncoder.matches(rawPassword, user.getPassword()));
    }

    private String normalizeUsername(String username) {
        if (username == null || username.isBlank()) {
            throw new IllegalArgumentException("Username ist erforderlich");
        }
        return username.trim();
    }

    private String normalizeEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("E-Mail ist erforderlich");
        }
        return email.trim().toLowerCase();
    }
}
