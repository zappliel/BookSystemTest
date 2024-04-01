package org.zjuse;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.RandomUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.zjuse.entity.Flight;
import org.zjuse.entity.FlightOrder;
import org.zjuse.entity.Hotel;
import org.zjuse.entity.HotelOrder;
import org.zjuse.entity.Order;
import org.zjuse.entity.Order.Type;
import org.zjuse.entity.Room;
import org.zjuse.management.FlightManagement;
import org.zjuse.management.HotelManagement;
import org.zjuse.management.OrderManagement;
import org.zjuse.management.RoomManagement;
import org.zjuse.repository.HotelRepository;
import org.zjuse.utils.ApiResult;
import org.zjuse.utils.RandomData;

@SpringBootTest
public class OrderTest {

    @Autowired
    private OrderManagement orderManagement;

    @Autowired
    private HotelManagement hotelManagement;

    @Autowired
    private FlightManagement flightManagement;

    @Autowired
    private RoomManagement roomManagement;

    @Autowired
    private HotelRepository hotelRepository;

    private static int MaxTestNum = 50; // hotel and flight test num is MaxTestNum respectively
    private List<Order> orders = new ArrayList<>();
    private List<Hotel> hotels = new ArrayList<>();
    private List<Room> rooms = new ArrayList<>();
    private List<Flight> flights = new ArrayList<>();

    @BeforeEach
    public void orderCreateTest() {
        orders.clear();
        flights.clear();
        rooms.clear();
        hotels.clear();
        assertTrue(orderManagement.resetOrder().ok);
        assertTrue(flightManagement.resetFlight().ok);
        assertTrue(roomManagement.resetRoom().ok);
        assertTrue(hotelManagement.resetHotel().ok);
        for (int i = 0; i < MaxTestNum; i++) {
            flights.add(RandomData.randomFlight());
            assertTrue(flightManagement.addFlight(flights.get(i)).ok);
        }

        for (int i = 0; i < MaxTestNum; i++) {
            hotels.add(RandomData.randomHotel());
            assertTrue(hotelManagement.addHotel(hotels.get(i)).ok);
        }
        for (int i = 0; i < MaxTestNum; i++) {
            Hotel hotel = hotels.get(RandomUtils.nextInt(0, MaxTestNum));
            rooms.add(RandomData.randomRoom(hotel));
            assertTrue(roomManagement.addRoom(rooms.get(i)).ok);
        }
    }

    @Test
    public void orderReadTest() {
        initOrder();
        ApiResult result = orderManagement.queryOrder(null, null, null, null, Type.HOTEL);
        assertTrue(result.ok);
        assertEquals(((List<Order>) result.payload).size(), MaxTestNum);
        for (int i = 0; i < MaxTestNum; i++) {
            assertEquals(orders.get(i).getCustomer_id(), ((List<Order>) result.payload).get(i).getCustomer_id());
        }
        result = orderManagement.queryOrder(null, null, null, null, Type.FLIGHT);
        assertTrue(result.ok);
        assertEquals(((List<Order>) result.payload).size(), MaxTestNum);
        for (int i = 0; i < MaxTestNum; i++) {
            assertEquals(orders.get(i + MaxTestNum).getCustomer_id(),
                    ((List<Order>) result.payload).get(i).getCustomer_id());
        }
    }

    @Test
    public void orderUpdateTest() {
        initOrder();
        for (Order i : orders) {
            i.setCustomer_id(RandomData.randomId());
            assertTrue(orderManagement.updateOrder(i).ok);
        }
    }

    @Test
    public void orderDeleteTest() {
        initOrder();
        for (Order i : orders) {
            assertTrue(orderManagement.deleteOrder(i.getId()).ok);
        }
    }

    private void initOrder() {
        for (int i = 0; i < MaxTestNum; i++) {
            Room room = rooms.get(i);
            Hotel hotel = room.getHotel();
            orders.add(RandomData.randomHotelOrder(room.getId(), hotel.getId()));
            assertTrue(orderManagement.addOrder(orders.get(i)).ok);
        }
        for (int i = 0; i < MaxTestNum; i++) {
            orders.add(RandomData.randomFlightOrder(flights.get(i).getId()));
            assertTrue(orderManagement.addOrder(orders.get(i + MaxTestNum)).ok);
        }
    }

    @Test
    public void hoteOrderConflictTest() {
        Room room = rooms.get(RandomUtils.nextInt(0, MaxTestNum));
        Date checkIn = RandomData.randomDate(0, 5);
        Date checkOut = RandomData.randomDate(5, 10);
        Hotel hotel = room.getHotel();
        // room1
        Order order1 = RandomData.randomHotelOrder(room.getId(), hotel.getId());
        HotelOrder hotelOrder = new HotelOrder(order1);
        hotelOrder.setCheck_in(checkIn);
        hotelOrder.setCheck_out(checkOut);
        hotelOrder.setStatus(Order.Status.PAID);
        order1 = new Order(hotelOrder);
        assertTrue(orderManagement.addOrder(order1).ok);
        // room2
        Order order2 = RandomData.randomHotelOrder(room.getId(), hotel.getId());
        hotelOrder = new HotelOrder(order2);
        hotelOrder.setCheck_in(checkOut);
        hotelOrder.setCheck_out(RandomData.randomDate(10, 15));
        hotelOrder.setStatus(Order.Status.UNPAID);
        order2 = new Order(hotelOrder);
        assertTrue(orderManagement.addOrder(order2).ok);
        // room3 is being booked
        Order order3 = RandomData.randomHotelOrder(room.getId(), hotel.getId());
        hotelOrder = new HotelOrder(order3);
        hotelOrder.setCheck_in(RandomData.randomDate(0, 3));
        hotelOrder.setCheck_out(RandomData.randomDate(8, 11));
        hotelOrder.setStatus(Order.Status.PAID);
        order3 = new Order(hotelOrder);
        assertFalse(orderManagement.addOrder(order3).ok);
        // delete room1 and room2
        assertTrue(orderManagement.deleteOrder(order1.getId()).ok);
        order2.setStatus(Order.Status.CANCELED);
        assertTrue(orderManagement.updateOrder(order2).ok);
        // room3 can be booked now
        assertTrue(orderManagement.addOrder(order3).ok);
    }

    @Test
    public void flightOrderConflictTest() {
        Flight flight = RandomData.randomFlight();
        assertTrue(flightManagement.addFlight(flight).ok);
        Order order = RandomData.randomFlightOrder(flight.getId());
        order.setStatus(Order.Status.UNPAID);
        for (int i = 0; i < flight.getSeatNum(); i++) {
            assertTrue(orderManagement.addOrder(order).ok);
            FlightOrder flightOrder = new FlightOrder(order);
            assertEquals(i, flightOrder.getSeat_id());
        }
        assertFalse(orderManagement.addOrder(order).ok);
    }

    @Test
    public void orderParallelTest() {
        int nThreads = ParallelThread.nThreads;
        // room parallel
        Hotel hotel = hotels.get(0);
        Room room = RandomData.randomRoom(hotels.get(0));
        assertTrue(roomManagement.addRoom(room).ok);
        Order order = RandomData.randomHotelOrder(room.getId(), hotel.getId());
        HotelOrder hotelOrder = new HotelOrder(order);
        hotelOrder.setCheck_in(RandomData.randomDate(0, 5));
        hotelOrder.setCheck_out(RandomData.randomDate(5, 10));
        hotelOrder.setStatus(Order.Status.PAID);
        order = new Order(hotelOrder);

        List<ParallelThread> orderThreads = new ArrayList<>();
        ParallelThread.acquireAll();
        for (int i = 0; i < nThreads; i++) {
            Order orderTest = new Order(order);
            ParallelThread thd = new ParallelThread(i, orderManagement, orderTest);
            thd.start();
            orderThreads.add(thd);
        }
        ParallelThread.releaseAll();
        for (ParallelThread thd : orderThreads) {
            try {
                thd.join();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        assertEquals(1, ParallelThread.successOps.get());
        ParallelThread.successOps.set(0);

        // flight parallel
        Flight flight = RandomData.randomFlight();
        assertTrue(flightManagement.addFlight(flight).ok);
        order = RandomData.randomFlightOrder(flight.getId());
        FlightOrder flightOrder = new FlightOrder(order);
        flightOrder.setStatus(Order.Status.PAID);
        order = new Order(flightOrder);
        for (int i = 0; i < flight.getSeatNum() - 1; i++) {
            assertTrue(orderManagement.addOrder(order).ok);
        }

        orderThreads = new ArrayList<>();
        ParallelThread.acquireAll();
        for (int i = 0; i < nThreads; i++) {
            Order orderTest = new Order(order);
            ParallelThread thd = new ParallelThread(i, orderManagement, orderTest);
            thd.start();
            orderThreads.add(thd);
        }
        ParallelThread.releaseAll();
        for (ParallelThread thd : orderThreads) {
            try {
                thd.join();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        assertEquals(1, ParallelThread.successOps.get());
    }
}
