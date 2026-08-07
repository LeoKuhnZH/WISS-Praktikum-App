package wiss.praktikumdb.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import wiss.praktikumdb.backend.dto.ChatRequest;
import wiss.praktikumdb.backend.repository.CustomerSupportAgent;
import wiss.praktikumdb.backend.service.ChatService;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:5173") // Für React Frontend
@RequestMapping("/api/chat")
public class ChatController {
    private final ChatService chatService;
    private final CustomerSupportAgent agent;

    public ChatController(ChatService chatService,CustomerSupportAgent agent) {
        this.chatService = chatService;
        this.agent=agent;
    }


    // public ChatController(CustomerSupportAgent agent) { this.agent = agent; }

    /**
     * 1. Reine Textnachricht senden
     */
    @PostMapping(value = "/{sessionId}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> handleTextMessage(
            @PathVariable("sessionId") String sessionId,
            @RequestBody Map<String, String> payload
    ) {
        String message = payload.getOrDefault("message", "");
        if (message.isBlank()) {
            return ResponseEntity.badRequest().body("Die Nachricht darf nicht leer sein.");
        }

        // TODO: Hier deinen AI-Agent / ChatService aufrufen
        // String botResponse = agent.chat(sessionId, message);
        String botResponse = "Danke für deine Frage bezüglich der Stelle! " +
                "Hier ist die Antwort auf deine Anfrage: " + message;

        return ResponseEntity.ok(botResponse);
    }

    /**
     * 2. Nachricht mit Dateiupload (z.B. CV / Lebenslauf als PDF oder TXT)
     */
    @PostMapping(value = "/{sessionId}/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> handleFileUploadMessage(
            @PathVariable("sessionId") String sessionId,
            @RequestParam(value = "message", required = false, defaultValue = "") String message,
            @RequestParam("file") MultipartFile file
    ) {
        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body("Bitte wähle eine gültige Datei aus.");
        }

        try {
            // Text aus der Datei auslesen (für .txt, .md, .csv)
            String fileContent = "";
            if (file.getContentType() != null && file.getContentType().contains("text")) {
                fileContent = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))
                        .lines()
                        .collect(Collectors.joining("\n"));
            }

            // Prompt für die KI zusammensetzen
            String combinedPrompt = String.format(
                    "Der Benutzer hat eine Datei hochgeladen: '%s' (Typ: %s).\n" +
                            "Dateiinhalt (Auszug):\n%s\n\n" +
                            "Benutzernachricht: %s",
                    file.getOriginalFilename(),
                    file.getContentType(),
                    fileContent.isBlank() ? "[Binärdatei/PDF - Inhalt verarbeitet]" : fileContent,
                    message
            );

            // TODO: An deinen KI-Agent weiterleiten
            // String botResponse = agent.chat(sessionId, combinedPrompt);
            String botResponse = "Ich habe deine Datei '" + file.getOriginalFilename() + "' erhalten! " +
                    (message.isBlank() ? "Was möchtest du dazu wissen?" : "Ich analysiere das für dich.");

            return ResponseEntity.ok(botResponse);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Fehler beim Verarbeiten der Datei: " + e.getMessage());
        }
    }
}
