package org.zjuse.management;

import org.zjuse.entity.Room;
import org.zjuse.utils.ApiResult;

public interface RoomManagement {

    /**
     * query rooms according the given conditions(sorted by id)
     * 
     * @param hotelId
     * @param roomClass
     * @param minPrice
     * @param maxPrice
     * @return status; the list of rooms will be returned in payload
     */
    ApiResult queryRoom(Long hotelId, String roomClass, Double minPrice, Double maxPrice);

    /**
     * add a new room
     * 
     * @param hotelId
     * @param roomClass
     * @param price
     * @return status; the id of the room will be returned in room
     */
    ApiResult addRoom(Room room);

    /**
     * update a room
     * (id cannot be changed)
     * 
     * @param room the room to be updated
     * @return status
     */
    ApiResult updateRoom(Room room);

    /**
     * delete a room
     * (if there are orders related to this room and the order is not finished, the room cannot be deleted)
     * 
     * @param id the id of the room to be deleted
     * @return status
     */
    ApiResult deleteRoom(Long id);

    /**
     * reset room table
     * (all data will be deleted)
     * 
     * @return status
     */
    ApiResult resetRoom();
}
