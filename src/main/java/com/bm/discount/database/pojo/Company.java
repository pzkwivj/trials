package com.bm.discount.database.pojo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.List;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "company", schema = "discount")
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long companyId;

    @NotBlank(message = "Ime kompanije je obavezno")
    @Column(name = "company_name", nullable = false)
    private String companyName;

    @Column(length = 200) // Usklađeno sa varchar(200) iz SQL-a
    private String address;

    @Size(min = 9, max = 9, message = "PIB mora imati tačno 9 cifara")
    @NotBlank(message = "PIB je obavezan")
    @Column(nullable = false, unique = true) // unique=true jer smo dodali UNIQUE INDEX u bazi
    private String pib;

    @JsonIgnore
    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL)
    private List<Product> products;

    // --- Getters and Setters ---
    public Long getCompanyId() {
        return companyId;
    }

    public void setCategoryId(Long companyId) {
        this.companyId = companyId;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPib() {
        return pib;
    }

    public void setPib(String pib) {
        this.pib = pib;
    }

    public List<Product> getProducts() {
        return products;
    }

    public void setProducts(List<Product> products) {
        this.products = products;
    }
}
