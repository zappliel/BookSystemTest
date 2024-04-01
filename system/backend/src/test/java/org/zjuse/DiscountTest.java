package org.zjuse;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.zjuse.entity.Discount;
import org.zjuse.entity.Flight;
import org.zjuse.entity.Hotel;
import org.zjuse.entity.Order.Type;
import org.zjuse.management.DiscountManagement;
import org.zjuse.management.FlightManagement;
import org.zjuse.management.HotelManagement;
import org.zjuse.management.RoomManagement;
import org.zjuse.utils.ApiResult;
import org.zjuse.utils.RandomData;

@SpringBootTest
public class DiscountTest {

    @Autowired
    private DiscountManagement discountManagement;

    @Autowired
    private HotelManagement hotelManagement;

    @Autowired
    private FlightManagement flightManagement;

    @Autowired
    private RoomManagement roomManagement;

    private static int MaxTestNum = 50;
    private List<Discount> discounts = new ArrayList<>();
    private List<Hotel> hotels = new ArrayList<>();
    private List<Flight> flights = new ArrayList<>();

    @BeforeEach
    public void discountCreateTest() {
        discounts.clear();
        hotels.clear();
        flights.clear();
        assertTrue(discountManagement.resetDiscount().ok);
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
            discounts.add(RandomData.randomHotelDiscount(hotels.get(i)));
            assertTrue(discountManagement.addDiscount(discounts.get(i)).ok);
        }
        for (int i = 0; i < MaxTestNum; i++) {
            discounts.add(RandomData.randomFlightDiscount(flights.get(i)));
            assertTrue(discountManagement.addDiscount(discounts.get(i + MaxTestNum)).ok);
        }
    }

    @Test
    public void discountReadTest() {
        ApiResult result = discountManagement.queryDiscount(null, Type.HOTEL);
        assertTrue(result.ok);
        assertEquals(((List<Discount>) result.payload).size(), MaxTestNum);
        for (int i = 0; i < MaxTestNum; i++) {
            assertEquals(((List<Discount>) result.payload).get(i).getServiceId(), hotels.get(i).getId());
        }

        result = discountManagement.queryDiscount(null, Type.FLIGHT);
        assertTrue(result.ok);
        assertEquals(((List<Discount>) result.payload).size(), MaxTestNum);
        for (int i = 0; i < MaxTestNum; i++) {
            assertEquals(((List<Discount>) result.payload).get(i).getServiceId(), flights.get(i).getId());
        }
    }

    @Test
    public void discountUpdateTest() {
        for (Discount discount : discounts) {
            assertTrue(discountManagement.updateDiscount(discount.getId(), RandomData.randomDiscountFactor()).ok);
        }
    }

    @Test
    public void discountDeleteTest() {
        for (Discount discount : discounts) {
            assertTrue(discountManagement.deleteDiscount(discount.getId()).ok);
        }
    }
}
