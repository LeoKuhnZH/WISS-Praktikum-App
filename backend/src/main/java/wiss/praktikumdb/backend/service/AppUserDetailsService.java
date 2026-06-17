package wiss.praktikumdb.backend.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import wiss.praktikumdb.backend.repository.AppUserRepository;

public class AppUserDetailsService implements UserDetailsService {
    private final AppUserRepository userRepository;

    /**
     * Instantiates a new App user details service.
     *
     * @param userRepository the user repository
     */
    public AppUserDetailsService(AppUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "User nicht gefunden: " + username));
    }
}
