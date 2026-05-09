/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.bm.discount.control;

import com.bm.discount.database.pojo.Discount;
import com.bm.discount.repo.DiscountRepository;
import com.bm.discount.service.DiscountService;
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
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class DiscountController {

    private final DiscountService discountService;

    // Ubrizgavamo Service umesto Repository-ja
    public DiscountController(DiscountService discountService) {
        this.discountService = discountService;
    }

    @GetMapping
    public List<Discount> getAllDiscounts() {
        return discountService.getAll();
    }

    @PostMapping
    public Discount createDiscount(@RequestBody Discount discount) {
        // Sada će Service sam izračunati cenu, ti samo pošalji procenat u JSON-u
        return discountService.save(discount);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Discount> getDiscountById(@PathVariable Long id) {
        Discount discount = discountService.findById(id);
        if (discount != null) {
            return ResponseEntity.ok(discount);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Discount> updateDiscount(@PathVariable Long id, @RequestBody Discount discountDetails) {
        Discount updated = discountService.update(id, discountDetails);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDiscount(@PathVariable Long id) {
        if (discountService.deleteById(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

// ... unutar kontrolera ...
    @GetMapping("/active")
    public List<Discount> getActiveDiscounts() {
        LocalDate today = LocalDate.now();
        return discountService.findActive(today);
    }

}
