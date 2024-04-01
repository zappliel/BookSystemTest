package org.zjuse.entity;

import java.sql.Timestamp;
import java.util.Random;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "`order`")
public class Order {

    public enum Status {
        UNPAID(0), PAID(1), CANCELED(2), FINISHED(3);

        private final int value;

        Status(int value) {
            this.value = value;
        }

        public int getValue() {
            return this.value;
        }

        public static Status valueOf(int value) {
            switch (value) {
                case 0:
                    return UNPAID;
                case 1:
                    return PAID;
                case 2:
                    return CANCELED;
                case 3:
                    return FINISHED;
                default:
                    return null;
            }
        }

        public static String toString(Status status) {
            switch (status) {
                case UNPAID:
                    return "未支付";
                case PAID:
                    return "已支付";
                case CANCELED:
                    return "已取消";
                case FINISHED:
                    return "已完成";
                default:
                    return null;
            }
        }

        public static int toInt(Status status) {
            switch (status) {
                case UNPAID:
                    return 0;
                case PAID:
                    return 1;
                case CANCELED:
                    return 2;
                case FINISHED:
                    return 3;
                default:
                    return -1;
            }
        }

        public static Status random() {
            return values()[new Random().nextInt(values().length)];
        }
    }

    public enum Type {
        HOTEL(0), FLIGHT(1);

        private final int value;

        Type(int value) {
            this.value = value;
        }

        public int getValue() {
            return this.value;
        }

        public static Type valueOf(int value) {
            switch (value) {
                case 0:
                    return HOTEL;
                case 1:
                    return FLIGHT;
                default:
                    return null;
            }
        }

        public static String toString(Type type) {
            switch (type) {
                case HOTEL:
                    return "酒店";
                case FLIGHT:
                    return "航班";
                default:
                    return null;
            }
        }

        public static int toInt(Type type) {
            switch (type) {
                case HOTEL:
                    return 0;
                case FLIGHT:
                    return 1;
                default:
                    return -1;
            }
        }
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "customer_id")
    private Long customer_id;

    @Column(name = "service_id")
    private Long service_id;

    @Column(name = "status")
    private Status status;

    @Column(name = "price")
    private Double price;

    @Column(name = "type")
    private Type type;

    @Column(name = "create_time")
    private Timestamp create_time;

    @Column(name = "payload")
    private String payload;

    public Order() {
    }

    public Order(HotelOrder order) {
        this.id = order.getId();
        this.customer_id = order.getCustomer_id();
        this.service_id = order.getService_id();
        this.status = order.getStatus();
        this.price = order.getPrice();
        this.type = order.getType();
        this.create_time = order.getCreate_time();
        this.payload = order.serialize();
    }

    public Order(FlightOrder order) {
        this.id = order.getId();
        this.customer_id = order.getCustomer_id();
        this.service_id = order.getService_id();
        this.status = order.getStatus();
        this.price = order.getPrice();
        this.type = order.getType();
        this.create_time = order.getCreate_time();
        this.payload = order.serialize();
    }

    public Order(Order order) {
        this.id = order.getId();
        this.customer_id = order.getCustomer_id();
        this.service_id = order.getService_id();
        this.status = order.getStatus();
        this.price = order.getPrice();
        this.type = order.getType();
        this.create_time = order.getCreate_time();
        this.payload = order.getPayload();
    }

    public Order(Long id, Long customer_id, Long service_id, Status status, Double price, Type type, String payload) {
        this.id = id;
        this.customer_id = customer_id;
        this.service_id = service_id;
        this.status = status;
        this.price = price;
        this.type = type;
        this.create_time = new Timestamp(System.currentTimeMillis());
        this.payload = payload;
    }

}
