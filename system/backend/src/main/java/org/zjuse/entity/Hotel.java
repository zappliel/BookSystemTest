package org.zjuse.entity;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "hotel")
public class Hotel {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "location")
    private String location;

    @Column(name = "star")
    private Integer star;

    @Column(name = "score")
    private Double score;

    public Hotel() {
    }

    public Hotel(Hotel hotel) {
        this.id = hotel.getId();
        this.name = hotel.getName();
        this.location = hotel.getLocation();
        this.star = hotel.getStar();
        this.score = hotel.getScore();
    }

    public Hotel(Long id, String name, String location, Integer star, Double score) {
        this.id = id;
        this.name = name;
        this.location = location;
        this.star = star;
        this.score = score;
    }
}
