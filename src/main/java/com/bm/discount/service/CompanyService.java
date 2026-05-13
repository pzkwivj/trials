package com.bm.discount.service;

import com.bm.discount.database.pojo.Company;
import com.bm.discount.repo.CompanyRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class CompanyService {

    private final CompanyRepository companyRepository;

    public CompanyService(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    public List<Company> getAll() {
        return companyRepository.findAll();
    }

    public Optional<Company> findById(Long id) {
        return companyRepository.findById(id);
    }

    public Company save(Company company) {
        // Biznis validacija: PIB mora da bude jedinstven (opciono, jer baza već ima UNIQUE)
        if (companyRepository.findByPib(company.getPib()).isPresent()) {
            throw new RuntimeException("Kompanija sa ovim PIB-om već postoji!");
        }
        return companyRepository.save(company);
    }

    public Company update(Long id, Company details) {
        return companyRepository.findById(id).map(company -> {
            company.setCompanyName(details.getCompanyName());
            company.setPib(details.getPib());
            company.setAddress(details.getAddress());
            return companyRepository.save(company);
        }).orElse(null);
    }

    public boolean deleteById(Long id) {
        if (companyRepository.existsById(id)) {
            companyRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
