package wiss.praktikumdb.backend.config;

import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.ollama.OllamaChatModel;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;

@Configuration
public class LangChainConfig {

    @Bean
    public ChatLanguageModel ollamaChatModel() {
        return OllamaChatModel.builder()
                .baseUrl("http://localhost:11434") // <-- Diese URL hat gefehlt oder war null
                .modelName("gemma2:2b")
                .timeout(Duration.ofMinutes(6))
// Passe den Modellnamen entsprechend an
                .build();
    }
}
