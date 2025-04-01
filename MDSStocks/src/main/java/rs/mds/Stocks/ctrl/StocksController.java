/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package rs.mds.Stocks.ctrl;

import java.util.List;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestBody;
import rs.mds.Stocks.ent.Stock;
import rs.mds.Stocks.serv.StocksService;
import org.springframework.beans.factory.annotation.Autowired;

/**
 *
 * @author Admin
 */
@RestController
@RequestMapping("/api/stocks")
public class StocksController {

    @Autowired
    StocksService stocksService;

    @GetMapping(value = "/all")
    public List<Stock> getAllStocks() {
        return stocksService.getAllStocks();
    }

    @PostMapping(value = "/save")
    public void save(Stock stock) {
        stocksService.save(stock);
    }

    @GetMapping(value = "/read")
    public Stock read(Long id) {
        return stocksService.read(id);
    }

    @GetMapping(value = "/delete")
    public void delete(Long id) {
        stocksService.delete(id);
    }
}
