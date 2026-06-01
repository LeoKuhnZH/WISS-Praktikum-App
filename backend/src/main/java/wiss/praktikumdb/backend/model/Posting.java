package wiss.praktikumdb.backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "postings")
public class Posting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String company;
    private String body;
    private String email;
    private String phone;
    private String fax;
    private String companyDescription;
    private String website;
    private String status;
    private LocalDate expirationDate;
    private LocalDateTime dateCreated;

    public Posting() {
    }

    public Posting(Long id, String title, String company, String body, String email, String phone, String fax,
                   String companyDescription, String website, String status, LocalDate expirationDate,
                   LocalDateTime dateCreated) {
        this.id = id;
        this.title = title;
        this.company = company;
        this.body = body;
        this.email = email;
        this.phone = phone;
        this.fax = fax;
        this.companyDescription = companyDescription;
        this.website = website;
        this.status = status;
        this.expirationDate = expirationDate;
        this.dateCreated = dateCreated;
        @Enumerated(EnumType.STRING)
        private PostingPosition position;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getFax() {
        return fax;
    }

    public void setFax(String fax) {
        this.fax = fax;
    }

    public String getCompanyDescription() {
        return companyDescription;
    }

    public void setCompanyDescription(String companyDescription) {
        this.companyDescription = companyDescription;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDate getExpirationDate() {
        return expirationDate;
    }

    public void setExpirationDate(LocalDate expirationDate) {
        this.expirationDate = expirationDate;
    }

    public LocalDateTime getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(LocalDateTime dateCreated) {
        this.dateCreated = dateCreated;
    }
    public PostingPosition getPosition() {
    return position;
    }

    public void setPosition(PostingPosition position) {
    this.position = position;
    }

    
}
