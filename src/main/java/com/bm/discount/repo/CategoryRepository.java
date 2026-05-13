package com.bm.discount.repo;

import com.bm.discount.database.pojo.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    
    // Pronalazi kategoriju po tačnom nazivu (korisno pri validaciji ili unosu)
    Optional<Category> findByCategoryName(String categoryName);
}
