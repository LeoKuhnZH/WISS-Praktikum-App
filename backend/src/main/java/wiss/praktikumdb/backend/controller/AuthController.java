package wiss.praktikumdb.backend.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import wiss.praktikumdb.backend.dto.LoginRequestDTO;
import wiss.praktikumdb.backend.dto.LoginResponseDTO;
import wiss.praktikumdb.backend.dto.RegisterRequestDTO;
import wiss.praktikumdb.backend.dto.RegisterResponseDTO;
import wiss.praktikumdb.backend.model.AppUser;
import wiss.praktikumdb.backend.model.Role;
import wiss.praktikumdb.backend.service.AppUserService;
import wiss.praktikumdb.backend.service.JwtService;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173") // Für React Frontend
public class AuthController {

    /**
     * The constant ERROR_TEXT_BEGINNING.
     */
    public static final String ERROR_TEXT_BEGINNING = "error";
    // Neue Version (AppUserService + JwtService)
    private final AppUserService appUserService;
    private final JwtService jwtService;

    /**
     * Instantiates a new Auth controller.
     *
     * @param appUserService the app user service
     * @param jwtService     the jwt service
     */
    public AuthController(AppUserService appUserService,
                          JwtService jwtService) {
        this.appUserService = appUserService;
        this.jwtService = jwtService;
    }

    /**
     * Register response entity.
     *
     * @param request the request
     * @return the response entity
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequestDTO request) {
        try {
            // Service Layer aufrufen
            AppUser newUser = appUserService.registerUser(
                    request.getUsername(),
                    request.getEmail(),
                    request.getPassword(),
                    Role.USER  // Default Role für neue User
            );

            // Response DTO erstellen
            RegisterResponseDTO response = new RegisterResponseDTO(
                    newUser.getId(),
                    newUser.getUsername(),
                    newUser.getEmail(),
                    newUser.getRole().name(),
                    "Registrierung erfolgreich"

            );

            // HTTP 200 OK mit Response Body
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            // HTTP 400 Bad Request bei Validation Errors
            Map<String, String> error = new HashMap<>();
            error.put(ERROR_TEXT_BEGINNING, e.getMessage());
            return ResponseEntity.badRequest().body(error);

        } catch (Exception e) {
            // HTTP 500 bei unerwarteten Fehlern
            Map<String, String> error = new HashMap<>();
            error.put(ERROR_TEXT_BEGINNING, "Registrierung fehlgeschlagen");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Test response entity.
     *
     * @return the response entity
     */
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Auth Controller funktioniert!");
    }

    /**
     * Login response entity.
     *
     * @param request the request
     * @return the response entity
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @Valid @RequestBody LoginRequestDTO request) {
        try {
            // 1. User finden (Username oder Email)
            Optional<AppUser> userOpt;

            // Prüfen ob Email oder Username
            if (request.getUsernameOrEmail().contains("@")) {
                // Hat @? → Email
                userOpt = appUserService
                        .findByEmail(request.getUsernameOrEmail());
            } else {
                // Kein @? → Username
                userOpt = appUserService
                        .findByUsername(request.getUsernameOrEmail());
            }

            // User existiert nicht
            if (userOpt.isEmpty()) {
                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of(ERROR_TEXT_BEGINNING, "Ungültige Anmeldedaten"));
            }

            AppUser user = userOpt.get();

            // 2. Passwort prüfen mit authenticateUser
            Optional<AppUser> authenticatedUser =
                    appUserService.authenticateUser(user.getUsername(),
                            request.getPassword());

            if (authenticatedUser.isEmpty()) {
                // Passwort falsch
                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of(ERROR_TEXT_BEGINNING, "Ungültige Anmeldedaten"));
            }

            // 3. JWT Token generieren
            String token = jwtService.generateToken(
                    user.getUsername(),
                    user.getRole().name()
            );




            // 4. Response DTO erstellen
            LoginResponseDTO response = new LoginResponseDTO(
                    token,
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getRole().name(),
                    86400000L  // 24 Stunden in ms
            );

            // 5. Success Response
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            // Unerwartete Fehler
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(ERROR_TEXT_BEGINNING,
                            "Ein Fehler ist aufgetreten: " + e.getMessage()));
        }
    }
}