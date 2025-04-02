/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package rs.mds.Stocks.ent;

import lombok.Getter;
import lombok.Setter;

/**
 *
 * @author Admin
 */
public class StockPair {

    @Getter
    @Setter
    private String name;
    
    @Getter
    @Setter
    private Stock buyDay;

    @Getter
    @Setter
    private Stock sellDay;
    
    @Getter
    @Setter
    private double profit;
    
    

    public StockPair(String name, Stock buyDay, Stock sellDay) {
        this.name = name;
        this.buyDay = buyDay;
        this.sellDay = sellDay;
    }
    
    public void calculateProfit() {
        this.profit = this.sellDay.getHigh() - this.buyDay.getLow();
    }

}
