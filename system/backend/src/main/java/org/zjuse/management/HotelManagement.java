package org.zjuse.management;

import org.zjuse.entity.Hotel;
import org.zjuse.utils.ApiResult;

public interface HotelManagement {
    /**
     * query hotels according the given conditions(sorted by id)
     * 
     * @param id
     * @param name
     * @param location
     * @param minStar
     * @param maxStar
     * @param minScore
     * @param maxScore
     * @return status; the list of hotels will be returned in payload
     */
    ApiResult queryHotel(Long id, String name, String location, Integer minStar, Integer maxStar, Double minScore,
            Double maxScore);

    /**
     * add a new hotel
     * 
     * @param hotel the hotel to be added
     * @return status; the id of the hotel will be returned in hotel
     */
    ApiResult addHotel(Hotel hotel);

    /**
     * update a hotel
     * (id cannot be changed)
     * 
     * @param hotel the hotel to be updated
     * @return status
     */
    ApiResult updateHotel(Hotel hotel);

    /**
     * delete a hotel
     * (comments and rooms related to this hotel will be deleted automatically)
     * (if there are orders related to this hotel and the order is not finished, the
     * hotel cannot be deleted)
     * 
     * @param id the id of the hotel to be deleted
     * @return status
     */
    ApiResult deleteHotel(Long id);

    /**
     * reset hotel table
     * (all data will be deleted)
     * 
     * @return status
     */
    ApiResult resetHotel();
}
