/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package rs.mds.Stocks.serv;

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
}
