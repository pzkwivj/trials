/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/UnitTests/JUnit4TestClass.java to edit this template
 */
package rs.mds.Stocks.serv;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import static org.junit.Assert.*;
import org.springframework.boot.test.context.SpringBootTest;
import rs.mds.Stocks.ent.Stock;
import rs.mds.Stocks.ent.StockPair;
import org.junit.jupiter.api.Test;

/**
 *
 * @author Admin
 */
@SpringBootTest
public class StockCalculatorTest {

    public StockCalculatorTest() {
    }

    @BeforeClass
    public static void setUpClass() {
    }

    @AfterClass
    public static void tearDownClass() {
    }

    @Before
    public void setUp() {
    }

    @After
    public void tearDown() {
    }

    /**
     * Test of singleTrade method, of class StockCalculator.
     */
    @Test
    public void testSingleTrade() {
        System.out.println("singleTrade");
        List<Stock> list = new ArrayList<>();
        String period_name = "Test Period";

        StockCalculator instance = new StockCalculator();
        Stock tStock = new Stock();
        tStock.setName("AMZN");
        tStock.setId(5695l);
        tStock.setLow(1832d);
        tStock.setHigh(1853d);
        tStock.setClose(1848d);
        tStock.setAdjClose(1848d);
        tStock.setDate(convert("2019-12-31"));
        tStock.setVolume(2506500d);

        Stock tStock1 = new Stock();
        tStock1.setName("META");
        tStock1.setId(5695l);
        tStock1.setLow(1830d);
        tStock1.setHigh(1855d);
        tStock1.setClose(1848d);
        tStock1.setAdjClose(1848d);
        tStock1.setDate(convert("2019-12-31"));
        tStock1.setVolume(2506500d);

        list.add(tStock);
        list.add(tStock1);

        StockPair result = instance.singleTrade(list, period_name);
        assertEquals(25, result.getProfit(), 0);
    }

    /**
     * Test of dayTrade method, of class StockCalculator.
     */
    @Test
    public void testDayTrade() {
        System.out.println("dayTrade");
        List<Stock> list = new ArrayList<>();
        String period_name = "Test Period";

        StockCalculator instance = new StockCalculator();
        Stock tStock = new Stock();
        tStock.setName("AMZN");
        tStock.setId(5695l);
        tStock.setLow(1832d);
        tStock.setHigh(1853d);
        tStock.setClose(1848d);
        tStock.setAdjClose(1848d);
        tStock.setDate(convert("2019-12-31"));
        tStock.setVolume(2506500d);

        Stock tStock1 = new Stock();
        tStock1.setName("META");
        tStock1.setId(5695l);
        tStock1.setLow(1830d);
        tStock1.setHigh(1855d);
        tStock1.setClose(1848d);
        tStock1.setAdjClose(1848d);
        tStock1.setDate(convert("2019-12-31"));
        tStock1.setVolume(2506500d);

        list.add(tStock);
        list.add(tStock1);

        StockPair result = instance.dayTrade(list, period_name);
        assertEquals(46, result.getProfit(), 0);
    }

    public LocalDate convert(String a) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        //formatter = formatter.withLocale(putAppropriateLocaleHere);  // Locale specifies human language for translating, and cultural norms for lowercase/uppercase and abbreviations and such. Example: Locale.US or Locale.CANADA_FRENCH
        LocalDate date = LocalDate.parse(a, formatter);
        return date;
    }

}
