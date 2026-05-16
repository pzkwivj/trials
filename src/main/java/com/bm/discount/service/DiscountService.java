package com.bm.discount.service;

import com.bm.discount.database.pojo.Discount;
import com.bm.discount.database.pojo.Product;
import com.bm.discount.repo.DiscountRepository;
import com.bm.discount.repo.ProductRepository;
import java.time.LocalDate;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DiscountService {

    private final DiscountRepository discountRepository;
    private final ProductRepository productRepository;

    public DiscountService(DiscountRepository discountRepository, ProductRepository productRepository) {
        this.discountRepository = discountRepository;
        this.productRepository = productRepository;
    }

    public List<Discount> getAll() {
        return discountRepository.findAll();
    }

    public Discount save(Discount discount) {
        if (discount.getStartDate() != null && discount.getEndDate() != null) {
            if (discount.getEndDate().isBefore(discount.getStartDate())) {
                throw new RuntimeException("Datum završetka ne može biti pre datuma početka!");
            }
        }

        if (discount.getStartDate() != null && discount.getStartDate().isBefore(LocalDate.now())) {
            throw new RuntimeException("Datum početka ne može biti u prošlosti !");
        }

        Product realProduct = productRepository.findById(discount.getProduct().getProductId())
                .orElseThrow(() -> new RuntimeException("Proizvod sa datim ID-jem ne postoji!"));

        // Postavljamo kompletan proizvod nazad u discount objekat
        discount.setProduct(realProduct);

        if (discount.getProduct() != null && discount.getPercentage() != null) {
            double originalPrice = discount.getProduct().getPrice();
            double percentage = discount.getPercentage();

            // Formula: cena - (cena * procenat / 100)
            double calculatedPrice = originalPrice - (originalPrice * percentage / 100);
            discount.setDiscountedPrice(calculatedPrice);
        }

        return discountRepository.save(discount);
    }

    public boolean deleteById(Long id) {
        if (discountRepository.existsById(id)) {
            discountRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public Discount findById(Long id) {
        return discountRepository.findById(id).orElse(null);
    }

    // U DiscountService.java
    public Discount update(Long id, Discount details) {
        return discountRepository.findById(id).map(discount -> {
            discount.setPercentage(details.getPercentage());
            discount.setStartDate(details.getStartDate());
            discount.setEndDate(details.getEndDate());
            discount.setProduct(details.getProduct());
            discount.setCompany(details.getCompany());

            // Ovde Service automatski ponovo računa cenu pre snimanja!
            return save(discount);
        }).orElse(null);
    }

    // U DiscountService.java
    public List<Discount> findActive(LocalDate date) {
        return discountRepository.findByStartDateLessThanEqualAndEndDateGreaterThanEqual(date, date);
    }

}
