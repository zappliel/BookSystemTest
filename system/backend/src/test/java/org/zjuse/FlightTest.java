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
import org.zjuse.entity.Flight;
import org.zjuse.entity.Order;
import org.zjuse.entity.Order.Type;
import org.zjuse.management.CommentManagement;
import org.zjuse.management.FlightManagement;
import org.zjuse.management.OrderManagement;
import org.zjuse.utils.ApiResult;
import org.zjuse.utils.RandomData;

@SpringBootTest
public class FlightTest {

    @Autowired
    private FlightManagement flightManagement;

    @Autowired
    private OrderManagement orderManagement;

    @Autowired
    private CommentManagement commentManagement;

    private static int MaxTestNum = 50;
    private List<Flight> flights = new ArrayList<>();

    @BeforeEach
    public void flightCreateTest() {
        flights.clear();
        assertTrue(orderManagement.resetOrder().ok);
        assertTrue(flightManagement.resetFlight().ok);
        for (int i = 0; i < MaxTestNum; i++) {
            flights.add(RandomData.randomFlight());
            assertTrue(flightManagement.addFlight(flights.get(i)).ok);
        }
    }

    @Test
    public void flightReadTest() {
        Double minPrice = 100.0, maxPrice = 200.0;
        List<Flight> queryResults = new ArrayList<>();
        for (Flight i : flights) {
            if (minPrice <= i.getPrice() && i.getPrice() <= maxPrice) {
                queryResults.add(i);
            }
        }
        ApiResult result = flightManagement.queryFlight(null, null, null, null, null, null, null, minPrice, maxPrice);
        assertTrue(result.ok);
        assertEquals(queryResults.size(), ((List<Flight>) result.payload).size());
        for (int i = 0; i < queryResults.size(); i++) {
            assertEquals(queryResults.get(i).getFrom(), ((List<Flight>) result.payload).get(i).getFrom());
            assertEquals(queryResults.get(i).getTo(), ((List<Flight>) result.payload).get(i).getTo());
        }
    }

    @Test
    public void flightUpdateTest() {
        for (Flight i : flights) {
            i.setPrice(Double.parseDouble(String.format("%.2f", RandomUtils.nextDouble(0.1, 100.0))));
            assertTrue(flightManagement.updateFlight(i).ok);
        }
    }

    @Test
    public void flightDeleteTest() {
        for (Flight i : flights) {
            assertTrue(flightManagement.deleteFlight(i.getId()).ok);
        }
    }

    @Test
    public void flightDeleteWithOrderTest() {
        Order orderFinished = RandomData.randomFlightOrder(flights.get(0).getId());
        Order orderPaid = RandomData.randomFlightOrder(flights.get(0).getId());
        orderFinished.setStatus(Order.Status.FINISHED);
        orderPaid.setStatus(Order.Status.PAID);
        assertTrue(orderManagement.addOrder(orderFinished).ok);
        assertTrue(orderManagement.addOrder(orderPaid).ok);
        assertFalse(flightManagement.deleteFlight(flights.get(0).getId()).ok);
        orderPaid.setStatus(Order.Status.CANCELED);
        assertTrue(orderManagement.updateOrder(orderPaid).ok);
        assertTrue(flightManagement.deleteFlight(flights.get(0).getId()).ok);
        assertTrue(
                ((List<Order>) orderManagement.queryOrder(null, null, flights.get(0).getId(), null, null).payload)
                        .isEmpty());
    }

    @Test
    public void flightDeleteWithCommentTest() {
        Comment comment = RandomData.randomComment(flights.get(0).getId(), Type.FLIGHT);
        assertTrue(commentManagement.addComment(comment).ok);
        assertTrue(flightManagement.deleteFlight(flights.get(0).getId()).ok);
        // check cascade delete
        assertTrue(((List<Comment>) commentManagement.queryComment(null, flights.get(0).getId(), Type.FLIGHT).payload)
                .isEmpty());
    }
}
