package org.zjuse;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.zjuse.entity.Comment;
import org.zjuse.entity.Flight;
import org.zjuse.entity.Hotel;
import org.zjuse.entity.Order.Type;
import org.zjuse.management.CommentManagement;
import org.zjuse.management.FlightManagement;
import org.zjuse.management.HotelManagement;
import org.zjuse.management.RoomManagement;
import org.zjuse.utils.ApiResult;
import org.zjuse.utils.RandomData;

@SpringBootTest
public class CommentTest {

    @Autowired
    private CommentManagement commentManagement;

    @Autowired
    private HotelManagement hotelManagement;

    @Autowired
    private FlightManagement flightManagement;

    @Autowired
    private RoomManagement roomManagement;

    private static int MaxTestNum = 50; // hotel and flight test num is MaxTestNum respectively
    private List<Comment> comments = new ArrayList<>();
    private List<Hotel> hotels = new ArrayList<>();
    private List<Flight> flights = new ArrayList<>();

    @BeforeEach
    public void commentCreateTest() {
        comments.clear();
        hotels.clear();
        flights.clear();
        assertTrue(commentManagement.resetComment().ok);
        assertTrue(roomManagement.resetRoom().ok);
        assertTrue(hotelManagement.resetHotel().ok);
        assertTrue(flightManagement.resetFlight().ok);

        for (int i = 0; i < MaxTestNum; i++) {
            hotels.add(RandomData.randomHotel());
            assertTrue(hotelManagement.addHotel(hotels.get(i)).ok);
        }

        for (int i = 0; i < MaxTestNum; i++) {
            flights.add(RandomData.randomFlight());
            assertTrue(flightManagement.addFlight(flights.get(i)).ok);
        }

        for (int i = 0; i < MaxTestNum; i++) {
            comments.add(RandomData.randomComment(hotels.get(i).getId(), Type.HOTEL));
            assertTrue(commentManagement.addComment(comments.get(i)).ok);
        }
        for (int i = 0; i < MaxTestNum; i++) {
            comments.add(RandomData.randomComment(flights.get(i).getId(), Type.FLIGHT));
            assertTrue(commentManagement.addComment(comments.get(i + MaxTestNum)).ok);
        }
    }

    @Test
    public void commentReadTest() {
        ApiResult result = commentManagement.queryComment(null, null, Type.HOTEL);
        assertTrue(result.ok);
        assertEquals(((List<Comment>)result.payload).size(), MaxTestNum);
        for (int i = 0; i < MaxTestNum; i++) {
            assertEquals(comments.get(i).getCustomerId(), ((List<Comment>)result.payload).get(i).getCustomerId());
        }
        result = commentManagement.queryComment(null, null, Type.FLIGHT);
        assertTrue(result.ok);
        assertEquals(((List<Comment>)result.payload).size(), MaxTestNum);
        for (int i = 0; i < MaxTestNum; i++) {
            assertEquals(comments.get(i + MaxTestNum).getCustomerId(), ((List<Comment>)result.payload).get(i).getCustomerId());
        }
    }

    @Test
    public void commentUpdateTest() {
        for (Comment comment : comments) {
            assertTrue(commentManagement.updateComment(comment.getId(), RandomData.randomScore(),RandomData.randomContent()).ok);
        }
    }

    @Test
    public void commentDeleteTest() {
        for (Comment comment : comments) {
            assertTrue(commentManagement.deleteComment(comment.getId()).ok);
        }
    }
}
