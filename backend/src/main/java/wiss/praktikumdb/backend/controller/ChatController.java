package wiss.praktikumdb.backend.controller;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
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

    @PostMapping(value = "/{sessionId}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> handleTextMessage(
            @PathVariable("sessionId") String sessionId,
            @RequestBody Map<String, Object> payload
    ) {
        if (payload == null) {
            return ResponseEntity.badRequest().body("Der Body darf nicht leer sein.");
        }

        String userMessage = String.valueOf(payload.getOrDefault("message", "")).trim();
        if (userMessage.isBlank()) {
            return ResponseEntity.badRequest().body("Die Nachricht darf nicht leer sein.");
        }

        // Stelle-Kontext aus dem Payload auslesen (falls vorhanden)
        // Stelle-Kontext aus dem Payload auslesen (falls vorhanden)
        // Stelle-Kontext aus dem Payload auslesen (falls vorhanden)
        String contextMessage = userMessage;

        if (payload.get("aktuelleStelle") instanceof Map<?, ?> rawMap) {
            // Sicheres Casting auf Map<String, Object>
            @SuppressWarnings("unchecked")
            Map<String, Object> stelle = (Map<String, Object>) rawMap;

            String titel = String.valueOf(stelle.getOrDefault("titel", "")).trim();

            if (!titel.isBlank()) {
                String firma = String.valueOf(stelle.getOrDefault("firma", "Smoca AG"));
                String beschreibung = String.valueOf(stelle.getOrDefault("beschreibung", "Keine Beschreibung"));
                String fachbereich = String.valueOf(stelle.getOrDefault("fachbereich", "K.A."));
                String praktikumsstart = String.valueOf(stelle.getOrDefault("praktikumsstart", "Nicht angegeben"));

                // Beschreibung auf 1000 Zeichen begrenzen
                if (beschreibung.length() > 1000) {
                    beschreibung = beschreibung.substring(0, 1000) + "... [Inhalt gekürzt]";
                }

                contextMessage = String.format(
                        "[Frage zu Stelle: \"%s\" bei \"%s\" | Fachbereich: %s | Start: %s | Beschreibung: %s]\n\nFrage: %s",
                        titel, firma, fachbereich, praktikumsstart, beschreibung, userMessage
                );
            }
        }

        try {
            // KI-Agent Aufruf mit angereichertem Prompt
            String botResponse = agent.chat(sessionId, contextMessage);
            return ResponseEntity.ok(botResponse);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Fehler bei der Verarbeitung: " + e.getMessage());
        }
    }



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
            String fileContent = "";
            String contentType = file.getContentType() != null ? file.getContentType() : "";
            String originalFilename = file.getOriginalFilename() != null ? file.getOriginalFilename() : "Unbekannt";

            // 1. Plain-Text (.txt, .md, .csv)
            if (contentType.contains("text")) {
                fileContent = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))
                        .lines()
                        .collect(Collectors.joining("\n"));
            }
            // 2. PDF-Dateien auslesen via PDFBox
            else if (contentType.equals("application/pdf") || originalFilename.toLowerCase().endsWith(".pdf")) {
                try (PDDocument document = PDDocument.load(file.getInputStream())) {
                    PDFTextStripper stripper = new PDFTextStripper();
                    fileContent = stripper.getText(document);
                }
            }

            // HIER KÜRZEN: Erst wenn fileContent befüllt ist
            if (fileContent.length() > 3000) {
                fileContent = fileContent.substring(0, 3000) + "\n...[Inhalt aus Platzgründen gekürzt]";
            }

            // Prompt für den KI-Agenten aufbauen
            String combinedPrompt = String.format(
                    "Der Benutzer hat eine Datei hochgeladen: '%s' (Typ: %s).\n" +
                            "Inhalt der Datei:\n%s\n\n" +
                            "Zusätzliche Benutzernachricht: %s",
                    originalFilename,
                    contentType,
                    fileContent.isBlank() ? "[Kein Text extrahierbar]" : fileContent,
                    message.isBlank() ? "Bitte analysiere diese Datei." : message
            );

            // KI-Agent mit dem kombinierten Prompt aufrufen
            String botResponse = agent.chat(sessionId, combinedPrompt);

            return ResponseEntity.ok(botResponse);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Fehler beim Verarbeiten der Datei: " + e.getMessage());
        }
    }






}
