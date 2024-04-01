package org.zjuse.web;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.zjuse.entity.FlightOrder;
import org.zjuse.entity.HotelOrder;
import org.zjuse.entity.Order;
import org.zjuse.entity.Order.Status;
import org.zjuse.entity.Order.Type;
import org.zjuse.management.OrderManagement;
import org.zjuse.utils.ApiResult;

import lombok.extern.slf4j.Slf4j;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/order")
@Slf4j
public class OrderWebService {

    @Autowired
    private OrderManagement orderManagement;

    /**
     * Query order by conditions
     * 
     * @param customerId
     * @param serviceId
     * @param status
     * @param type
     * @return List<Order>
     *         attention: Order is the base class of HotelOrder and FlightOrder, you
     *         need to cast it to the correct type
     */
    @GetMapping("/query")
    public List<Order> queryOrder(@RequestParam(value = "id", required = false) Long id,
            @RequestParam(value = "customer_id", required = false) Long customerId,
            @RequestParam(value = "service_id", required = false) Long serviceId,
            @RequestParam(value = "status", required = false) Status status,
            @RequestParam(value = "type", required = false) Type type) {
        ApiResult result = orderManagement.queryOrder(id, customerId, serviceId, status, type);
        if (!result.ok) {
            log.warn("Failed to query order, reason: " + result.message);
            return null;
        }
        return (List<Order>) result.payload;
    }

    @GetMapping("/queryHotel")
    public List<HotelOrder> queryHotelOrder(@RequestParam(value = "id", required = false) Long id,
            @RequestParam(value = "customer_id", required = false) Long customerId,
            @RequestParam(value = "service_id", required = false) Long serviceId,
            @RequestParam(value = "status", required = false) Status status) {
        ApiResult result = orderManagement.queryHotelOrder(id, customerId, serviceId, status);
        if (!result.ok) {
            log.warn("Failed to query order, reason: " + result.message);
            return null;
        }
        return (List<HotelOrder>) result.payload;
    }

    @GetMapping("/queryFlight")
    public List<FlightOrder> queryFlightOrder(@RequestParam(value = "id", required = false) Long id,
            @RequestParam(value = "customer_id", required = false) Long customerId,
            @RequestParam(value = "service_id", required = false) Long serviceId,
            @RequestParam(value = "status", required = false) Status status) {
        ApiResult result = orderManagement.queryFlightOrder(id, customerId, serviceId, status);
        if (!result.ok) {
            log.warn("Failed to query order, reason: " + result.message);
            return null;
        }
        return (List<FlightOrder>) result.payload;
    }

    /**
     * Add a order
     * 
     * @param customerId
     * @param serviceId
     * @param status
     * @param price
     * @param type
     * @param room_id
     * @param check_in
     * @param check_out
     * @param seat_id
     * @return HttpStatus
     */
    @PostMapping("/add")
    public String addOrder(
            @RequestParam(value = "customer_id", required = true) Long customerId,
            @RequestParam(value = "service_id", required = true) Long serviceId,
            @RequestParam(value = "status", required = true) Status status,
            @RequestParam(value = "price", required = true) Double price,
            @RequestParam(value = "type", required = true) Type type,
            @RequestParam(value = "room_id", required = false) Long room_id,
            @RequestParam(value = "check_in", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date check_in_input,
            @RequestParam(value = "check_out", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date check_out_input) {
        Order order = null;
        java.sql.Date check_in = null;
        java.sql.Date check_out = null;
        if (check_in_input != null) {
            check_in = new java.sql.Date(check_in_input.getTime());
        }
        if (check_out_input != null) {
            check_out = new java.sql.Date(check_out_input.getTime());
        }
        if (type == Type.HOTEL) {
            HotelOrder hotelOrder = new HotelOrder(null, customerId, serviceId, status, price, room_id, check_in,
                    check_out);
            order = new Order(hotelOrder);
        } else if (type == Type.FLIGHT) {
            FlightOrder flightOrder = new FlightOrder(null, customerId, serviceId, status, price, null);
            order = new Order(flightOrder);
        } else {
            log.warn("Failed to add order, reason: unknown order type");
            return "unknown order type";
        }
        ApiResult result = orderManagement.addOrder(order);
        if (!result.ok) {
            log.warn("Failed to add order, reason: " + result.message);
            return result.message;
        }
        return "";
    }

    /**
     * Update a order
     * 
     * @param id
     * @param customerId
     * @param serviceId
     * @param status
     * @param price
     * @param type
     * @param payload
     * @return HttpStatus
     */
    @PutMapping("/update")
    public HttpStatus updateOrder(@RequestParam(value = "id", required = true) Long id,
            @RequestParam(value = "status", required = true) Status status) {
        ApiResult query = orderManagement.queryOrder(id, null, null, null, null);
        if (!query.ok) {
            log.warn("Failed to update order, reason: " + query.message);
            return HttpStatus.BAD_REQUEST;
        }
        Order order = ((List<Order>) query.payload).get(0);
        if (order == null) {
            log.warn("Failed to update order, reason: order not found");
            return HttpStatus.BAD_REQUEST;
        }
        order.setStatus(status);
        ApiResult result = orderManagement.updateOrder(order);
        if (!result.ok) {
            log.warn("Failed to update order, reason: " + result.message);
            return HttpStatus.BAD_REQUEST;
        }
        return HttpStatus.OK;
    }


    /**
     * Delete a order
     * 
     * @param id
     * @return HttpStatus
     */
    @DeleteMapping("/delete")
    public HttpStatus deleteOrder(@RequestParam(value = "id", required = true) Long id) {
        ApiResult result = orderManagement.deleteOrder(id);
        if (!result.ok) {
            log.warn("Failed to delete order, reason: " + result.message);
            return HttpStatus.BAD_REQUEST;
        }
        return HttpStatus.OK;
    }
}
