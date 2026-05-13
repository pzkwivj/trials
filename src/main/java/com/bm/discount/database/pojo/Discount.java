package com.bm.discount.database.pojo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "discount", schema = "discount")
public class Discount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long discountId;

    @Column(name = "discount_percent", nullable = false)
    private Double percentage; // Mapirano na discount_percent

    @Column(name = "discounted_price", nullable = false)
    private Double discountedPrice;

    @Column(name = "from_date", nullable = false)
    private LocalDate startDate; // Mapirano na from_date

    @Column(name = "to_date", nullable = false)
    private LocalDate endDate; // Mapirano na to_date

    @JsonIgnoreProperties("discounts") // Isključi samo listu popusta unutar proizvoda
    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @JsonIgnoreProperties("products") // Isključi listu proizvoda unutar kompanije
    @ManyToOne
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    // --- Getters and Setters ---
    // Obavezno proveri da li imena metoda odgovaraju poljima iznad
    public Long getDiscountId() {
        return discountId;
    }

    public void setDiscountId(Long discountId) {
        this.discountId = discountId;
    }

    public Double getPercentage() {
        return percentage;
    }

    public void setPercentage(Double percentage) {
        this.percentage = percentage;
    }

    public Double getDiscountedPrice() {
        return discountedPrice;
    }

    public void setDiscountedPrice(Double discountedPrice) {
        this.discountedPrice = discountedPrice;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Company getCompany() {
        return company;
    }

    public void setCompany(Company company) {
        this.company = company;
    }
}
