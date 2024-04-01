package org.zjuse.entity;

import lombok.Data;

@Data
public class FlightOrder extends Order {
    private Integer seat_id;
    
    public FlightOrder(Long id, Long customer_id, Long service_id, Status status, Double price, Integer seat_id) {
        super(id, customer_id, service_id, status, price, Type.FLIGHT, "");
        this.seat_id = seat_id;
        this.setPayload(serialize());
    }

    public FlightOrder(Order order) {
        super(order.getId(), order.getCustomer_id(), order.getService_id(), order.getStatus(), order.getPrice(),
                Type.FLIGHT, order.getPayload());
        this.setCreate_time(order.getCreate_time());
        if (order.getPayload() != null && !order.getPayload().equals("")) {
            String[] payload = order.getPayload().split(",");
            this.seat_id = Integer.parseInt(payload[0]);
        }
    }

    public String serialize() {
        if (this.seat_id == null) {
            return null;
        }
        return String.format("%d", this.seat_id);
    }

}
