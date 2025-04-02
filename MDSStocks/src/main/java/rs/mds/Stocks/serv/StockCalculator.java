/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package rs.mds.Stocks.serv;

import java.util.List;
import org.springframework.stereotype.Component;
import rs.mds.Stocks.ent.Stock;
import rs.mds.Stocks.ent.StockPair;

/**
 *
 * @author Admin
 */
@Component
public class StockCalculator {

    public StockPair singleTrade(List<Stock> list, String period_name) {
        double diff = -Double.MAX_VALUE;
        StockPair pair = new StockPair(period_name, null, null);
        for (Stock oStock : list) {
            for (Stock iStock : list) {
                if (oStock.getDate().isAfter(iStock.getDate())) {
                    continue;
                }
                if ((iStock.getHigh() - oStock.getLow()) > diff) {
                    pair.setSellDay(iStock);
                    pair.setBuyDay(oStock);
                    diff = iStock.getHigh() - oStock.getLow();
                }
            }
        }
        try {
           pair.calculateProfit();
        }
        catch (Exception e){
            e.printStackTrace();
        }
        return pair;
    }

}
