package wiss.praktikumdb.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterRequestDTO {

    @NotBlank(message = "Username ist erforderlich")
    @Size(min = 3, max = 50, message = "Username muss zwischen 3 und 50 Zeichen lang sein")
    private String username;

    @NotBlank(message = "E-Mail ist erforderlich")
    @Email(message = "E-Mail ist ungültig")
    @Size(max = 100, message = "E-Mail darf maximal 100 Zeichen lang sein")
    private String email;

    @NotBlank(message = "Passwort ist erforderlich")
    @Size(min = 8, max = 100, message = "Passwort muss zwischen 8 und 100 Zeichen lang sein")
    private String password;

    public RegisterRequestDTO() {
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
