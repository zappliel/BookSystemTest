package org.zjuse;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.RandomUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.zjuse.entity.Hotel;
import org.zjuse.entity.Room;
import org.zjuse.management.HotelManagement;
import org.zjuse.management.RoomManagement;
import org.zjuse.utils.ApiResult;
import org.zjuse.utils.RandomData;

@SpringBootTest
public class RoomTest {

    @Autowired
    private RoomManagement roomManagement;

    @Autowired
    private HotelManagement hotelManagement;

    private static int MaxTestNum = 50;
    private List<Room> rooms = new ArrayList<>();
    private List<Hotel> hotels = new ArrayList<>();

    @BeforeEach
    public void roomCreateTest() {
        rooms.clear();
        hotels.clear();
        assertTrue(roomManagement.resetRoom().ok);
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
    public void roomReadTest() {
        Double minPrice = RandomUtils.nextDouble(10.0, 20.0), maxPrice = RandomUtils.nextDouble(90.0, 100.0);
        List<Room> queryResults = new ArrayList<>();
        for (Room i : rooms) {
            if (minPrice <= i.getPrice() && i.getPrice() <= maxPrice) {
                queryResults.add(i);
            }
        }
        ApiResult result = roomManagement.queryRoom(null, null, minPrice, maxPrice);
        assertTrue(result.ok);
        assertEquals(queryResults.size(), ((List<Room>)result.payload).size());
        for (int i = 0; i < queryResults.size(); i++) {
            assertEquals(queryResults.get(i).getRoomClass(), ((List<Room>)result.payload).get(i).getRoomClass());
        }
    }

    @Test
    public void roomUpdateTest() {
        for (Room i : rooms) {
            i.setPrice(RandomUtils.nextDouble(10.0, 20.0));
            ApiResult result = roomManagement.updateRoom(i);
            assertTrue(result.ok);
        }
    }

    @Test
    public void roomDeleteTest() {
        for (Room i : rooms) {
            ApiResult result = roomManagement.deleteRoom(i.getId());
            assertTrue(result.ok);
        }
    }
}
