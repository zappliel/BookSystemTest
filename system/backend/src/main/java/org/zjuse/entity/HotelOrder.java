package org.zjuse.entity;

import java.sql.Date;

import lombok.Data;

@Data
public class HotelOrder extends Order {
    private Long room_id;
    private Date check_in;
    private Date check_out;

    public HotelOrder(Long id, Long customer_id, Long service_id, Status status, Double price, Long room_id, Date check_in, Date check_out) {
        super(id, customer_id, service_id, status, price, Type.HOTEL, "");
        this.room_id = room_id;
        this.check_in = check_in;
        this.check_out = check_out;
        this.setPayload(this.serialize());
    }

    public HotelOrder(Order order) {
        super(order.getId(), order.getCustomer_id(), order.getService_id(), order.getStatus(), order.getPrice(), Type.HOTEL, order.getPayload());
        this.setCreate_time(order.getCreate_time());
        String[] payload = order.getPayload().split(",");
        this.room_id = Long.parseLong(payload[0]);
        this.check_in = new Date(Long.parseLong(payload[1]));
        this.check_out = new Date(Long.parseLong(payload[2]));
    }

    public String serialize() {
        return String.format("%d,%d,%d", this.room_id, this.check_in.getTime(), this.check_out.getTime());
    }

}
