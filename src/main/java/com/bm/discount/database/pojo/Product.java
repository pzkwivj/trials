package com.bm.discount.database.pojo;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "product", schema = "discount")
public class Product {

    @Id
    // PAŽNJA: Ako baza ne koristi Auto-increment, ukloni @GeneratedValue 
    // ili proveri da li tvoj SQL dialekt podržava Identity
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productId;

    @Column(name = "product_name", nullable = false) // Usklađeno sa NOT NULL
    private String productName;

    @Column(nullable = false) // Usklađeno sa NOT NULL
    private Double price;

    @ManyToOne
    @JoinColumn(name = "company_id", nullable = false) // Usklađeno sa NOT NULL
    private Company company;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false) // Usklađeno sa NOT NULL
    private Category category;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    private List<Discount> discounts;

        public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Company getCompany() {
        return company;
    }

    public void setCompany(Company company) {
        this.company = company;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public List<Discount> getDiscounts() {
        return discounts;
    }

    public void setDiscounts(List<Discount> discounts) {
        this.discounts = discounts;
    }
}

