package org.zjuse.demo;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "item")
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int productId;
    private int sellerId;
    private double price;
    private String name;
    private int stock;
    private int sold;
    private String description;
    private String img;
}
