package com.bm.discount.repo;

import com.bm.discount.database.pojo.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CompanyRepository extends JpaRepository<Company, Long> {
    
    // Veoma korisno za proveru pre unosa nove kompanije
    Optional<Company> findByPib(String pib);
    
    // Pretraga kompanija po nazivu
    java.util.List<Company> findByCompanyNameContainingIgnoreCase(String name);
}
