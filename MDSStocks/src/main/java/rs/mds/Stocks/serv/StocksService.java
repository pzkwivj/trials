/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package rs.mds.Stocks.serv;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;
import rs.mds.Stocks.ent.Stock;
import rs.mds.Stocks.repo.StocksRepo;
import org.springframework.beans.factory.annotation.Autowired;

/**
 *
 * @author Admin
 */
@Service
public class StocksService {

    @Autowired
    private StocksRepo stocksRepo;

    @PersistenceContext
    private EntityManager entityManager;

    public List<Stock> findByCustomCriteria(String name, LocalDate from, LocalDate to) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Stock> query = cb.createQuery(Stock.class);
        Root<Stock> root = query.from(Stock.class);

        Predicate nameCondition = cb.equal(root.get("name"), name);
        Predicate fromCondition = cb.greaterThanOrEqualTo(root.get("date"), from);
        Predicate toCondition = cb.lessThanOrEqualTo(root.get("date"), to);
        query.where(cb.and(nameCondition, fromCondition, toCondition));

        return entityManager.createQuery(query).getResultList();
    }

    public List<Stock> getAllStocks() {
        return stocksRepo.findAll();
    }

    public void save(Stock stock) {
        stocksRepo.save(stock);
    }

    public Stock read(Long id) {
        Optional<Stock> o = stocksRepo.findById(id);
        if (o.isPresent()) {
            return o.get();
        } else {
            return null;
        }
    }

    public void delete(Long id) {
        stocksRepo.deleteById(id);
    }

    public LocalDate convert(String a) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        //formatter = formatter.withLocale(putAppropriateLocaleHere);  // Locale specifies human language for translating, and cultural norms for lowercase/uppercase and abbreviations and such. Example: Locale.US or Locale.CANADA_FRENCH
        LocalDate date = LocalDate.parse(a, formatter);
        return date;
    }
}
