package org.zjuse.entity;

import java.sql.Date;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "room")
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne(targetEntity = Hotel.class, cascade = CascadeType.MERGE, fetch = FetchType.LAZY)
    @JoinColumn(name = "hotel_id", referencedColumnName = "id")
    private Hotel hotel;

    @Column(name = "room_class")
    private String roomClass;

    @Column(name = "price")
    private Double price;

    @Column(name = "booked")
    private StringBuffer booked;

    @Column(name = "start_date")
    private Date startDate;

    public static final Integer MAX_BOOKED = 14;

    public Room() {
    }

    public Room(Long id, Hotel hotel, String roomClass, Double price) {
        this.id = id;
        this.hotel = hotel;
        this.roomClass = roomClass;
        this.price = price;
        this.startDate = new Date(System.currentTimeMillis());
        this.booked = new StringBuffer(MAX_BOOKED / 8 + 1);
        for (int i = 0; i < booked.capacity(); i++) {
            this.booked.append((char) 0);
        }
    }

}
