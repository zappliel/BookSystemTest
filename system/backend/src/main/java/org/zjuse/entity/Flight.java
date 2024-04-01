package org.zjuse.entity;

import java.sql.Timestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "flight")
public class Flight {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "`from`")
    private String from;

    @Column(name = "`to`")
    private String to;

    @Column(name = "`departure_time`")
    private Timestamp departureTime;

    @Column(name = "`arrival_time`")
    private Timestamp arrivalTime;

    @Column(name = "score")
    private Double score;

    @Column(name = "price")
    private Double price;

    @Column(name = "seat_num")
    private Integer seatNum;

    @Column(name = "booked")
    private StringBuffer booked;

    public Flight() {
    }

    public Flight(Long id, String from, String to, Timestamp departureTime, Timestamp arrivalTime, Double score,
            Double price, Integer seatNum) {
        this.id = id;
        this.from = from;
        this.to = to;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
        this.score = score;
        this.price = price;
        this.seatNum = seatNum;
        this.booked = new StringBuffer(seatNum / 8 + 1);
        for (int i = 0; i < booked.capacity(); i++) {
            this.booked.append((char) 0);
        }
    }
}
