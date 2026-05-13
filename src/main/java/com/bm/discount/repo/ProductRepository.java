package com.bm.discount.repo;

import com.bm.discount.database.pojo.Product;
import com.bm.discount.database.pojo.Category;
import com.bm.discount.database.pojo.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    // Pronalazi sve proizvode određene kategorije
    List<Product> findByCategory(Category category);

    // Pronalazi sve proizvode određene kompanije
    List<Product> findByCompany(Company company);

    // Pronalazi proizvod po tačnom nazivu
    List<Product> findByProductName(String productName);

    // Pronalazi proizvode čiji naziv sadrži određenu reč (npr. pretraga)
    List<Product> findByProductNameContainingIgnoreCase(String name);
}
