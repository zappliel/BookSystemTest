package org.zjuse.web;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.zjuse.entity.Hotel;
import org.zjuse.entity.Room;
import org.zjuse.management.RoomManagement;
import org.zjuse.repository.HotelRepository;
import org.zjuse.utils.ApiResult;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/room")
@Slf4j
public class RoomWebService {

    @Autowired
    private RoomManagement roomManagement;

    @Autowired
    private HotelRepository hotelRepository;

    @Data
    private class QueryRoom {
        public Long id;
        public Long hotelId;
        public String roomClass;
        public Double price;

        public QueryRoom(Room room) {
            this.id = room.getId();
            this.hotelId = room.getHotel().getId();
            this.roomClass = room.getRoomClass();
            this.price = room.getPrice();
        }
    }

    /**
     * Query room by conditions
     * 
     * @param hotelId
     * @param roomClass
     * @param minPrice
     * @param maxPrice
     * @return List<QueryRoom>
     */
    @GetMapping("/query")
    public List<QueryRoom> queryRoom(@RequestParam(value = "hotelId", required = false) Long hotelId,
            @RequestParam(value = "roomClass", required = false) String roomClass,
            @RequestParam(value = "minPrice", required = false) Double minPrice,
            @RequestParam(value = "maxPrice", required = false) Double maxPrice) {
        ApiResult result = roomManagement.queryRoom(hotelId, roomClass, minPrice, maxPrice);
        if (!result.ok) {
            log.warn("Failed to query room, reason: " + result.message);
            return null;
        }
        List<Room> rooms = (List<Room>) result.payload;
        List<QueryRoom> queryRooms = new ArrayList<>();
        for (Room room : rooms) {
            QueryRoom queryRoom = new QueryRoom(room);
            queryRooms.add(queryRoom);
        }
        return queryRooms;
    }

    /**
     * Add a room
     * 
     * @param hotelId
     * @param roomClass
     * @param price
     * @return HttpStatus
     */
    @PostMapping("/add")
    public HttpStatus addRoom(@RequestParam(value = "hotelId", required = true) Long hotelId,
            @RequestParam(value = "roomClass", required = true) String roomClass,
            @RequestParam(value = "price", required = true) Double price) {
        Hotel hotel = hotelRepository.findById(hotelId).orElse(null);
        if (hotel == null) {
            log.warn("Failed to add room, reason: hotel not found");
            return HttpStatus.BAD_REQUEST;
        }
        Room room = new Room(null, hotel, roomClass, price);
        ApiResult result = roomManagement.addRoom(room);
        if (!result.ok) {
            log.warn("Failed to add room, reason: " + result.message);
            return HttpStatus.BAD_REQUEST;
        }
        return HttpStatus.OK;
    }

    /**
     * Update a room
     * 
     * @param id
     * @param hotelId
     * @param roomClass
     * @param price
     * @return HttpStatus
     */
    @PutMapping("/update")
    public HttpStatus updateRoom(@RequestParam(value = "id", required = true) Long id,
            @RequestParam(value = "hotelId", required = true) Long hotelId,
            @RequestParam(value = "roomClass", required = false) String roomClass,
            @RequestParam(value = "price", required = false) Double price) {
        Hotel hotel = hotelRepository.findById(hotelId).orElse(null);
        if (hotel == null) {
            log.warn("Failed to update room, reason: hotel not found");
            return HttpStatus.BAD_REQUEST;
        }
        Room room = new Room(id, hotel, roomClass, price);
        ApiResult result = roomManagement.updateRoom(room);
        if (!result.ok) {
            log.warn("Failed to update room, reason: " + result.message);
            return HttpStatus.BAD_REQUEST;
        }
        return HttpStatus.OK;
    }

    /**
     * Delete a room
     * 
     * @param id
     * @return HttpStatus
     */
    @DeleteMapping("/delete")
    public HttpStatus deleteRoom(@RequestParam(value = "id", required = true) Long id) {
        ApiResult result = roomManagement.deleteRoom(id);
        if (!result.ok) {
            log.warn("Failed to delete room, reason: " + result.message);
            return HttpStatus.BAD_REQUEST;
        }
        return HttpStatus.OK;
    }

}
