package wiss.praktikumdb.backend.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import wiss.praktikumdb.backend.dto.PostingDTO;
import wiss.praktikumdb.backend.service.PostingService;

import java.util.List;

@RestController
@RequestMapping("/api/posting")
@CrossOrigin(origins = "http://localhost:5173")
public class PostingController {
    private final PostingService postingService;

    public PostingController(PostingService postingService) {
        this.postingService = postingService;
    }

    @GetMapping("/all")
    public List<PostingDTO> getAllPostings() {
        return postingService.getAllPostings();
    }

    @GetMapping("/active")
    public List<PostingDTO> getActivePostings() {
        return postingService.getActivePostings();
    }

    @GetMapping("/search/id/{id}")
    public PostingDTO getPostingById(@PathVariable Long id) {
        return postingService.getPostingById(id);
    }

    @GetMapping("/search/company/{company}")
    public List<PostingDTO> getPostingsByCompany(@PathVariable String company) {
        return postingService.getPostingsByCompany(company);
    }

    @GetMapping("/search/status/{status}")
    public List<PostingDTO> getPostingsByStatus(@PathVariable String status) {
        return postingService.getPostingsByStatus(status);
    }

    @GetMapping("/search/title/{keyword}")
    public List<PostingDTO> getPostingsByTitle(@PathVariable String keyword) {
        return postingService.searchPostingsByTitle(keyword);
    }

    @PostMapping("/create")
    @PreAuthorize("hasAnyRole('ADMIN', 'SCHULE')")
    public PostingDTO createPosting(@RequestBody PostingDTO dto) {
        return postingService.createPosting(dto);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public PostingDTO updatePosting(@PathVariable Long id, @RequestBody PostingDTO dto) {
        return postingService.updatePosting(id, dto);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deletePosting(@PathVariable Long id) {
        postingService.deletePosting(id);
    }
}
