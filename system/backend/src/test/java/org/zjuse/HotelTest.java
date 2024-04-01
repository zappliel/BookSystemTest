package org.zjuse;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.RandomUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.zjuse.entity.Comment;
import org.zjuse.entity.Hotel;
import org.zjuse.entity.Order;
import org.zjuse.entity.Order.Type;
import org.zjuse.entity.Room;
import org.zjuse.management.CommentManagement;
import org.zjuse.management.HotelManagement;
import org.zjuse.management.OrderManagement;
import org.zjuse.management.RoomManagement;
import org.zjuse.utils.ApiResult;
import org.zjuse.utils.RandomData;

@SpringBootTest
public class HotelTest {

    @Autowired
    private HotelManagement hotelManagement;

    @Autowired
    private OrderManagement orderManagement;

    @Autowired
    private RoomManagement roomManagement;

    @Autowired
    private CommentManagement commentManagement;

    private static int MaxTestNum = 50;
    private List<Hotel> hotels = new ArrayList<>();
    private List<Room> rooms = new ArrayList<>();

    @BeforeEach
    public void hotelCreateTest() {
        hotels.clear();
        assertTrue(roomManagement.resetRoom().ok);
        assertTrue(orderManagement.resetOrder().ok);
        assertTrue(hotelManagement.resetHotel().ok);
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
    public void hotelReadTest() {
        Double minScore = RandomUtils.nextDouble(10.0, 20.0), maxScore = RandomUtils.nextDouble(90.0, 100.0);
        List<Hotel> queryResults = new ArrayList<>();
        for (Hotel i : hotels) {
            if (minScore <= i.getScore() && i.getScore() <= maxScore) {
                queryResults.add(i);
            }
        }
        ApiResult result = hotelManagement.queryHotel(null, null, null, null, null, minScore, maxScore);
        assertTrue(result.ok);
        assertEquals(queryResults.size(), ((List<Hotel>) result.payload).size());
        for (int i = 0; i < queryResults.size(); i++) {
            assertEquals(queryResults.get(i).getName(), ((List<Hotel>) result.payload).get(i).getName());
        }
    }

    @Test
    public void hotelUpdateTest() {
        for (Hotel i : hotels) {
            i.setScore(Double.parseDouble(String.format("%.2f", RandomUtils.nextDouble(0.1, 100.0))));
            assertTrue(hotelManagement.updateHotel(i).ok);
        }
    }

    @Test
    public void hotelDeleteTest() {
        for (Hotel i : hotels) {
            assertTrue(hotelManagement.deleteHotel(i.getId()).ok);
        }
    }

    @Test
    public void hotelDeleteWithOrderTest() {
        Room room = rooms.get(RandomUtils.nextInt(0, MaxTestNum));
        Hotel hotel = room.getHotel();
        Order orderFinished = RandomData.randomHotelOrder(room.getId(), hotel.getId());
        Order orderPaid = RandomData.randomHotelOrder(room.getId(), hotel.getId());
        orderFinished.setStatus(Order.Status.FINISHED);
        orderPaid.setStatus(Order.Status.PAID);
        assertTrue(orderManagement.addOrder(orderFinished).ok);
        assertTrue(orderManagement.addOrder(orderPaid).ok);
        assertFalse(hotelManagement.deleteHotel(hotel.getId()).ok);
        orderPaid.setStatus(Order.Status.CANCELED);
        assertTrue(orderManagement.updateOrder(orderPaid).ok);
        assertTrue(hotelManagement.deleteHotel(hotel.getId()).ok);
        assertTrue(
                ((List<Order>) orderManagement.queryOrder(null, null, hotel.getId(), null, null).payload).isEmpty());
    }

    @Test
    public void hotelDeleteWithRoomTest() {
        Room room = RandomData.randomRoom(hotels.get(0));
        assertTrue(roomManagement.addRoom(room).ok);
        assertTrue(hotelManagement.deleteHotel(hotels.get(0).getId()).ok);
        // check cascade delete
        assertTrue(((List<Room>) roomManagement.queryRoom(hotels.get(0).getId(), null, null, null).payload).isEmpty());
    }

    @Test
    public void hotelDeleteWithCommentTest() {
        Comment comment = RandomData.randomComment(hotels.get(0).getId(), Type.HOTEL);
        assertTrue(commentManagement.addComment(comment).ok);
        assertTrue(hotelManagement.deleteHotel(hotels.get(0).getId()).ok);
        // check cascade delete
        assertTrue(((List<Comment>) commentManagement.queryComment(null, hotels.get(0).getId(), Type.HOTEL).payload)
                .isEmpty());
    }
}
