package wiss.praktikumdb.backend.repository;

// 1. Backend-Eigene Imports (Platzhalter/Beispiel für andere Klassen aus deinem Projekt)
// import wiss.praktikumdb.backend.domain.ChatSession;
// import wiss.praktikumdb.backend.dto.ChatMessageDto;

// 2. LangChain4j Imports
import dev.langchain4j.service.MemoryId;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import dev.langchain4j.service.spring.AiService;

@AiService
public interface CustomerSupportAgent {

    @SystemMessage("""
        You are a helpful customer support chatbot.
        Respond politely and concisely.
        """)
    String chat(@MemoryId String sessionId, @UserMessage String message);
}