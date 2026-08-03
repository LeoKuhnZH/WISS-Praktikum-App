package wiss.praktikumdb.backend.controller;

import org.springframework.web.bind.annotation.*;
import wiss.praktikumdb.backend.repository.CustomerSupportAgent;
import wiss.praktikumdb.backend.service.ChatService;

@RestController
@RequestMapping("/api/chat")
public class ChatController {
    private final ChatService chatService;
    private final CustomerSupportAgent agent;

    public ChatController(ChatService chatService,CustomerSupportAgent agent) {
        this.chatService = chatService;
        this.agent=agent;
    }



    @PostMapping("/{sessionId}")
    public String chat(@PathVariable String sessionId, @RequestBody String message) {
        return agent.chat(sessionId, message);
    }
}
