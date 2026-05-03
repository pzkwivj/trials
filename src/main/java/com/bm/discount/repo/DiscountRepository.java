package com.bm.discount.repo;

import com.bm.discount.database.pojo.Discount;
import com.bm.discount.database.pojo.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface DiscountRepository extends JpaRepository<Discount, Long> {

    // Pronalazi sve popuste koji su aktivni na određeni datum
    // Upit proverava: startDate <= datum <= endDate
    List<Discount> findByStartDateLessThanEqualAndEndDateGreaterThanEqual(LocalDate date, LocalDate dateAgain);

    // Pronalazi sve popuste za konkretan proizvod
    List<Discount> findByProduct(Product product);
}
