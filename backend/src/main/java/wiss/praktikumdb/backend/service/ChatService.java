package wiss.praktikumdb.backend.service;

import org.springframework.stereotype.Service;
import wiss.praktikumdb.backend.repository.CustomerSupportAgent;

@Service
public class ChatService {

    private final CustomerSupportAgent assistant;

    public ChatService(CustomerSupportAgent assistant) {
        this.assistant = assistant;
    }

    public String getResponse(String sessionId, String userMessage) {
        return assistant.chat(sessionId, userMessage);
    }

}
