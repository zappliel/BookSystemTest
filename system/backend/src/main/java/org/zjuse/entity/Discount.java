package org.zjuse.entity;

import org.zjuse.entity.Order.Type;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "discount")
public class Discount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    
    @Column(name = "service_id")
    private Long serviceId;

    @Column(name = "type")
    private Type type;
    
    @Column(name = "discount_factor")
    private Double discountFactor;

    public Discount() {
    }

    public Discount(Long id, Long serviceId, Type type, Double discountFactor) {
        this.id = id;
        this.serviceId = serviceId;
        this.type = type;
        this.discountFactor = discountFactor;
    }
}
