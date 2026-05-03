package com.bm.discount.database.pojo;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "company", schema = "discount")
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long companyId;

    @Column(name = "company_name", nullable = false)
    private String name;

    @Column(nullable = false)
    private String pib;   // must not be null        

    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL)
    private List<Product> products;

    // Getters and Setters
    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Product> getProducts() {
        return products;
    }

    public void setProducts(List<Product> products) {
        this.products = products;
    }

    public String getPib() {
        return pib;
    }

    public void setPib(String pib) {
        this.pib = pib;
    }
}
