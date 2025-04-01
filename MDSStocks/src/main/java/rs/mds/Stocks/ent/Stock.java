/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

package rs.mds.Stocks.ent;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;


/**
 *
 * @author Admin
 */
@Entity
@Table(name="STOCKS")
@Getter
@Setter
public class Stock {
    
    @Id
    @Column(name="ID")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    
    @Column(name="NAME")
    private String name;
    
    @Column(name="DATE")
    private LocalDate date;
    
    @Column(name="OPEN")
    private Double open;
    
    @Column(name="CLOSE")
    private Double close;
    
    @Column(name="LOW")
    private Double low;
    
    @Column(name="HIGH")
    private Double high;
    
    @Column(name="ADJCLOSE")
    private Double adjClose;
    
    @Column(name="VOLUME")
    private Double volume;
    
    

}
