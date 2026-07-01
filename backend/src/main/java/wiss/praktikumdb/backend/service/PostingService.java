package wiss.praktikumdb.backend.service;

import wiss.praktikumdb.backend.dto.PostingDTO;
import wiss.praktikumdb.backend.model.Posting;
import wiss.praktikumdb.backend.repository.PostingRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PostingService {

    private final PostingRepository postingRepository;

    public PostingService(PostingRepository postingRepository) {
        this.postingRepository = postingRepository;
    }

    /** Alle Postings abrufen */
    public List<PostingDTO> getAllPostings() {
        return postingRepository.findAll().stream()
                .map(this::toDTO)
                .toList();
    }

    /** Posting nach ID abrufen */
    public PostingDTO getPostingById(Long id) {
        Posting posting = postingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Posting not found with id: " + id));
        return toDTO(posting);
    }

    /** Neues Posting erstellen */
    public PostingDTO createPosting(PostingDTO dto) {
        Posting posting = toEntity(dto);
        posting.setDateCreated(LocalDateTime.now());
        Posting saved = postingRepository.save(posting);
        return toDTO(saved);
    }

    /** Posting aktualisieren */
    public PostingDTO updatePosting(Long id, PostingDTO dto) {
        Posting posting = postingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Posting not found with id: " + id));

        posting.setTitle(dto.getTitle());
        posting.setCompany(dto.getCompany());
        posting.setBody(dto.getBody());
        posting.setEmail(dto.getEmail());
        posting.setPhone(dto.getPhone());
        posting.setCompanyDescription(dto.getCompanyDescription());
        posting.setWebsite(dto.getWebsite());
        posting.setStatus(dto.getStatus());
        posting.setExpirationDate(dto.getExpirationDate());
        posting.setPosition(dto.getPosition());

        Posting updated = postingRepository.save(posting);
        return toDTO(updated);
    }

    /** Posting löschen */
    public void deletePosting(Long id) {
        if (!postingRepository.existsById(id)) {
            throw new RuntimeException("Posting not found with id: " + id);
        }
        postingRepository.deleteById(id);
    }

    /** Postings nach Firma suchen */
    public List<PostingDTO> getPostingsByCompany(String company) {
        return postingRepository.findByCompany(company).stream()
                .map(this::toDTO)
                .toList();
    }

    /** Postings nach Status filtern */
    public List<PostingDTO> getPostingsByStatus(String status) {
        return postingRepository.findByStatus(status).stream()
                .map(this::toDTO)
                .toList();
    }

    /** Postings nach Titel suchen */
    public List<PostingDTO> searchPostingsByTitle(String keyword) {
        return postingRepository.findByTitleContainingIgnoreCase(keyword).stream()
                .map(this::toDTO)
                .toList();
    }

    /** Aktive Postings (nicht abgelaufen) */
    public List<PostingDTO> getActivePostings() {
        return postingRepository.findByExpirationDateAfter(LocalDate.now()).stream()
                .map(this::toDTO)
                .toList();
    }

    // Entity -> DTO (ohne fax)
    private PostingDTO toDTO(Posting posting) {
        PostingDTO dto = new PostingDTO();
        dto.setId(posting.getId());
        dto.setTitle(posting.getTitle());
        dto.setCompany(posting.getCompany());
        dto.setBody(posting.getBody());
        dto.setEmail(posting.getEmail());
        dto.setPhone(posting.getPhone());
        dto.setCompanyDescription(posting.getCompanyDescription());
        dto.setWebsite(posting.getWebsite());
        dto.setStatus(posting.getStatus());
        dto.setExpirationDate(posting.getExpirationDate());
        dto.setDateCreated(posting.getDateCreated());
        dto.setPosition(posting.getPosition());
        return dto;
    }

    // DTO -> Entity
    private Posting toEntity(PostingDTO dto) {
        Posting posting = new Posting();
        posting.setTitle(dto.getTitle());
        posting.setCompany(dto.getCompany());
        posting.setBody(dto.getBody());
        posting.setEmail(dto.getEmail());
        posting.setPhone(dto.getPhone());
        posting.setCompanyDescription(dto.getCompanyDescription());
        posting.setWebsite(dto.getWebsite());
        posting.setStatus(dto.getStatus());
        posting.setExpirationDate(dto.getExpirationDate());
        posting.setPosition(dto.getPosition());
        return posting;
    }
}
