/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.bm.discount.control;

import com.bm.discount.database.pojo.Company;
import com.bm.discount.repo.CompanyRepository;
import com.bm.discount.service.CompanyService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/companies")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class CompanyController {

    private final CompanyService companyService;
    private final String sifra = "123";

    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    @GetMapping
    public List<Company> getAllCompanies() {
        return companyService.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Company> getCompanyById(@PathVariable Long id) {
        return companyService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createCompany(@Valid @RequestBody Company company, @RequestHeader(value = "X-Admin-Token", required = false) String token) {
        if (!sifra.equals(token)) {
            return ResponseEntity.status(403).body("Pristup odbijen. Niste administrator!");
        }
        Company savedCompany = companyService.save(company);
        return ResponseEntity.ok(savedCompany);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCompany(@PathVariable Long id, @RequestBody Company companyDetails, @RequestHeader(value = "X-Admin-Token", required = false) String token) {
        if (!sifra.equals(token)) {
            return ResponseEntity.status(403).body("Pristup odbijen. Niste administrator!");
        }
        Company company = companyService.update(id, companyDetails);
        if (company != null) {
            return ResponseEntity.ok(company);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCompany(@PathVariable Long id, @RequestHeader(value = "X-Admin-Token", required = false) String token) {
        if (!sifra.equals(token)) {
            return ResponseEntity.status(403).body("Pristup odbijen. Niste administrator!");
        }
        if (companyService.deleteById(id)) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
