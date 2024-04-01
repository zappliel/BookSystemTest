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
@Table(name = "comment")
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "customer_id")
    private Long customerId;

    @Column(name = "service_id")
    private Long serviceId;

    @Column(name = "type")
    private Type type;

    @Column(name = "score")
    private Double score;

    @Column(name = "content")
    private String content;

    public Comment() {
    }

    public Comment(Long id, Long customerId, Long serviceId, Type type, Double score, String content) {
        this.id = id;
        this.customerId = customerId;
        this.serviceId = serviceId;
        this.type = type;
        this.score = score;
        this.content = content;
    }
}
