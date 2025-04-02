/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package rs.mds.Stocks.ent;

/**
 *
 * @author Admin
 */
public class StockPair {

    private String name;

    private Stock buyDay;

    private Stock sellDay;

    private double profit;

    public StockPair(String name, Stock buyDay, Stock sellDay) {
        this.name = name;
        this.buyDay = buyDay;
        this.sellDay = sellDay;
    }

    public void calculateProfit() {
        this.profit = this.sellDay.getHigh() - this.buyDay.getLow();
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Stock getBuyDay() {
        return buyDay;
    }

    public void setBuyDay(Stock buyDay) {
        this.buyDay = buyDay;
    }

    public Stock getSellDay() {
        return sellDay;
    }

    public void setSellDay(Stock sellDay) {
        this.sellDay = sellDay;
    }

    public double getProfit() {
        return profit;
    }

    public void setProfit(double profit) {
        this.profit = profit;
    }

}
