package org.zjuse.demo;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "orders")
public class Orders {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int orderId;
    private int productId;
    private int buyerId;
    private int sellerId;
    private int num;
    private double money;
    private int orderState;
    private String complaint;
    private String refund;
    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime createTime;
    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime payTime;
    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime finishTime;
    private String productName;
}
