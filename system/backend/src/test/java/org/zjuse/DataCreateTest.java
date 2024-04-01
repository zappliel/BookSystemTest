package org.zjuse;

import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.zjuse.entity.Comment;
import org.zjuse.entity.Discount;
import org.zjuse.entity.Flight;
import org.zjuse.entity.Hotel;
import org.zjuse.entity.Order;
import org.zjuse.entity.Order.Type;
import org.zjuse.entity.Room;
import org.zjuse.management.CommentManagement;
import org.zjuse.management.DiscountManagement;
import org.zjuse.management.FlightManagement;
import org.zjuse.management.HotelManagement;
import org.zjuse.management.OrderManagement;
import org.zjuse.management.RoomManagement;
import org.zjuse.utils.RandomData;

@SpringBootTest
public class DataCreateTest {

    @Autowired
    private HotelManagement hotelManagement;

    @Autowired
    private FlightManagement flightManagement;

    @Autowired
    private OrderManagement orderManagement;

    @Autowired
    private RoomManagement roomManagement;

    @Autowired
    private CommentManagement commentManagement;

    @Autowired
    private DiscountManagement discountManagement;

    private static int MaxTestNum = 50;
    private List<Hotel> hotels = new ArrayList<>();
    private List<Room> rooms = new ArrayList<>();
    private List<Flight> flights = new ArrayList<>();
    private List<Order> orders = new ArrayList<>();
    private List<Comment> comments = new ArrayList<>();
    private List<Discount> discounts = new ArrayList<>();

    @Test
    public void dataCreateTest() {
        hotels.clear();
        rooms.clear();
        flights.clear();
        orders.clear();
        comments.clear();
        discounts.clear();
        assertTrue(roomManagement.resetRoom().ok);
        assertTrue(commentManagement.resetComment().ok);
        assertTrue(discountManagement.resetDiscount().ok);
        assertTrue(orderManagement.resetOrder().ok);
        assertTrue(hotelManagement.resetHotel().ok);
        assertTrue(flightManagement.resetFlight().ok);

        // hotel and room
        for (int i = 0; i < MaxTestNum; i++) {
            hotels.add(RandomData.randomHotel());
            assertTrue(hotelManagement.addHotel(hotels.get(i)).ok);
        }
        for (Hotel hotel : hotels) {
            for (int i = 0; i < MaxTestNum; i++) {
                Room room = RandomData.randomRoom(hotel);
                rooms.add(room);
                assertTrue(roomManagement.addRoom(room).ok);
            }
        }
        // flight
        for (int i = 0; i < MaxTestNum; i++) {
            flights.add(RandomData.randomFlight());
            assertTrue(flightManagement.addFlight(flights.get(i)).ok);
        }
        // order
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
        // comment
        for (int i = 0; i < MaxTestNum; i++) {
            comments.add(RandomData.randomComment(hotels.get(i).getId(), Type.HOTEL));
            assertTrue(commentManagement.addComment(comments.get(i)).ok);
        }
        for (int i = 0; i < MaxTestNum; i++) {
            comments.add(RandomData.randomComment(flights.get(i).getId(), Type.FLIGHT));
            assertTrue(commentManagement.addComment(comments.get(i + MaxTestNum)).ok);
        }
        // discount
        for (int i = 0; i < MaxTestNum / 3; i++) {
            discounts.add(RandomData.randomHotelDiscount(hotels.get(i)));
            assertTrue(discountManagement.addDiscount(discounts.get(i)).ok);
        }
        for (int i = 0; i < MaxTestNum / 3; i++) {
            discounts.add(RandomData.randomFlightDiscount(flights.get(i)));
            assertTrue(discountManagement.addDiscount(discounts.get(i + MaxTestNum / 3)).ok);
        }
    }
}
