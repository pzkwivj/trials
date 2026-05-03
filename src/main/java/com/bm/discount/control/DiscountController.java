/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.bm.discount.control;

import com.bm.discount.database.pojo.Discount;
import com.bm.discount.repo.DiscountRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.time.LocalDate;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@RequestMapping("/discounts")
@CrossOrigin(origins = "http://localhost:3000") // Dozvoljava React-u pristup
public class DiscountController {

    @Autowired
    private DiscountRepository discountRepository;

    @GetMapping
    public List<Discount> getAllDiscounts() {
        return discountRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Discount> getDiscountById(@PathVariable Long id) {
        return discountRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Discount createDiscount(@RequestBody Discount discount) {
        return discountRepository.save(discount);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Discount> updateDiscount(@PathVariable Long id, @RequestBody Discount discountDetails) {
        return discountRepository.findById(id).map(discount -> {
            // Usklađivanje sa POJO poljima (from_date, to_date, discounted_price)
            discount.setPercentage(discountDetails.getPercentage());
            discount.setDiscountedPrice(discountDetails.getDiscountedPrice());
            discount.setStartDate(discountDetails.getStartDate());
            discount.setEndDate(discountDetails.getEndDate());

            // Ažuriranje veza ako se promene proizvod ili firma
            discount.setProduct(discountDetails.getProduct());
            discount.setCompany(discountDetails.getCompany());

            return ResponseEntity.ok(discountRepository.save(discount));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDiscount(@PathVariable Long id) {
        return discountRepository.findById(id).map(discount -> {
            discountRepository.delete(discount);
            return ResponseEntity.noContent().build();
        }).orElse(ResponseEntity.notFound().build());
    }

// ... unutar kontrolera ...
    @GetMapping("/active")
    public List<Discount> getActiveDiscounts() {
        LocalDate today = LocalDate.now();
        return discountRepository.findByStartDateLessThanEqualAndEndDateGreaterThanEqual(today, today);
    }

}
